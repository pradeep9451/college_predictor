const express = require('express');
const axios = require('axios');
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.get('/get-google-reviews', async (req, res) => {
  const { collegeName } = req.query;

  try {
    const searchRes = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json`, {
      params: {
        input: collegeName,
        inputtype: 'textquery',
        fields: 'place_id',
        key: GOOGLE_API_KEY,
      },
    });

    const placeId = searchRes.data.candidates[0]?.place_id;
    if (!placeId) return res.status(404).json({ error: 'Place not found' });

    const detailRes = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,rating,reviews,formatted_address,url',
        key: GOOGLE_API_KEY,
      },
    });

    const place = detailRes.data.result;
    res.json({
      name: place.name,
      rating: place.rating,
      address: place.formatted_address,
      mapsUrl: place.url,
      reviews: place.reviews || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Google reviews' });
  }
});

module.exports = router;
