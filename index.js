const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const FIXED_CURSEFORGE_API_KEY = '$2a$10$GJ9CpePZJS.ic3LN4GQyG.YsejAKXgW2DkytLMI5oinUnhTUFVr6C';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/mods', async (req, res) => {
  if (!FIXED_CURSEFORGE_API_KEY || FIXED_CURSEFORGE_API_KEY === 'ضع_مفتاح_api_هنا') {
    return res.status(500).json({ error: 'الرجاء وضع مفتاح CurseForge API داخل ملف server.js' });
  }

  const { q = '', classId = '', sortField = '2' } = req.query;
  let url = `https://api.curseforge.com/v1/mods/search?gameId=78022&sortField=${sortField}&sortOrder=desc&pageSize=24`;
  if (q) url += `&searchFilter=${encodeURIComponent(q)}`;
  if (classId) url += `&classId=${encodeURIComponent(classId)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'x-api-key': FIXED_CURSEFORGE_API_KEY
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'فشل الاتصال بمصدر البيانات. تحقق من صحة مفتاح API.' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'حدث خطأ في الخادم المحلي أثناء جلب البيانات.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 موقع MODCRAFT يعمل بنجاح! افتح الرابط التالي في المتصفح:\n👉 http://localhost:${PORT}\n`);
});
