import axios from 'axios';

export async function fetchPage(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; AssignmentBot/1.0)',
    },
  });

  return response.data;
}
