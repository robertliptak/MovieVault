import fetch from "node-fetch";

export const getMoviesByTitle = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const encodedTitle = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodedTitle}&include_adult=false&language=en-US&page=1`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.MOVIES_API_KEY}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.status_message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
