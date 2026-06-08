module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { category, audience, platforms } = req.body || {};

  if (!category || !platforms || platforms.length === 0) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const platformConfig = {
    '小红书': '种草笔记，亲身体验感强，标题带具体数字或细节，像朋友推荐',
    '抖音': '极短有力，留悬念，意外转折，让人忍不住想看下去',
    '微信私域': '干货避坑，横向测评，帮用户做决策，建立信任感'
  };

  const selectedPlatformDesc = platforms.map(p => `${p}（${platformConfig[p] || p}）`).join('、');

  const prompt = `你是一位资深自行车媒体新媒体运营，深度了解骑行圈文化，尤其是咖啡骑群体的审美和语言习惯。

【账号标题风格参考样本（高互动真实数据）】
- 喝了骑车更快？甜菜根汁横向测评！
- 一口气骑行300公里选什么骑行裤？
- Van Rysel顶级车架打5折？
- 一台10-20万的自行车，有什么魔力？
- 人生第一台布加迪！
- 全国仅有一台的自行车！
- 气动头盔第一次上路，意外发现了一件事

【标题规律】
- 小红书：亲身体验感 + 具体数字，口语化，像朋友说话
- 抖音：极短有力，意外转折悬念，不说教不爹味
- 微信私域：干货避坑，横向测评，建立信任感

请为以下需求生成内容选题，每个平台各1条，共${platforms.length}条：
品类：${category}
目标人群：${audience || '咖啡骑车友'}
目标平台：${selectedPlatformDesc}

只返回JSON，格式如下，不要有任何其他文字：
{"topics":[{"platform":"平台名","direction":"选题角度","title":"爆款标题","hook":"内容钩子一句话","post_time":"建议发布时间","tags":["标签1","标签2"]}]}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'API error' });
    }

    const text = data.content?.map(i => i.text || '').join('') || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: '解析失败: ' + text.slice(0, 100) });

    const parsed = JSON.parse(match[0]);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
