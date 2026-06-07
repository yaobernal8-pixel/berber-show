export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category, audience, platforms } = req.body;

  if (!category || !platforms || platforms.length === 0) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const styleGuide = `
【账号标题风格参考样本（高互动真实数据）】
- 喝了骑车更快？甜菜根汁横向测评！
- 一口气骑行300公里选什么骑行裤？
- Van Rysel顶级车架打5折？
- 一台10-20万的自行车，有什么魔力？
- 人生第一台布加迪！
- 全国仅有一台的自行车！

【提炼出的标题规律】
- 小红书：亲身体验感 + 具体数字/细节，用问句或悬念引发共鸣，口语化，像朋友在说话
- 抖音：极短有力 + 意外转折悬念，不说教，不爹味，让读者好奇「然后呢」
- 微信私域：避坑/干货视角 + 横向测评，强调专业感和信任感，帮读者做决策

【禁止的风格】
- 居高临下的教育语气（「你以为…其实…」「骑完才知道差距」）
- 泛滥的营销腔（「颠覆认知」「改变你的骑行」）
- 过度堆砌形容词`;

  const platformConfig = {
    '小红书': '种草笔记，亲身体验感强，标题带具体数字或细节，像朋友推荐',
    '抖音': '极短有力，留悬念，意外转折，让人忍不住想看下去',
    '微信私域': '干货避坑，横向测评，帮用户做决策，建立信任感'
  };

  const selectedPlatformDesc = platforms
    .map(p => `${p}（${platformConfig[p] || p}）`)
    .join('、');

  const prompt = `你是一位资深自行车媒体新媒体运营，深度了解骑行圈文化，尤其是咖啡骑群体的审美和语言习惯。

${styleGuide}

请为以下需求生成内容选题，每个平台各1条，共${platforms.length}条：
- 品类：${category}
- 目标人群：${audience || '咖啡骑车友'}
- 目标平台：${selectedPlatformDesc}

严格模仿上方账号的标题风格，不要生成通用AI味道的内容。

请严格按以下JSON格式返回，不包含任何其他文字：
{
  "topics": [
    {
      "platform": "平台名",
      "direction": "选题角度（4字以内）",
      "title": "爆款标题",
      "hook": "内容钩子，说明前3秒/开头怎么吸引人（1句话）",
      "post_time": "建议发布时间段",
      "tags": ["标签1", "标签2"]
    }
  ]
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.content.map(i => i.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
