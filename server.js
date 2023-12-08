const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;

// 允许从任何源获取资源
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// 静态文件服务（因为你的文件都在根目录）
app.use(express.static('.'));

// 域名查询路由
app.get('/check-domain', async (req, res) => {
    const domain = req.query.domain;
    if (!domain) {
        return res.status(400).json({ error: '请提供域名' });
    }

    // 拆分域名为 name 和 suffix
    const parts = domain.split('.');
    const name = parts[0];
    const suffix = parts.slice(1).join('.');

    try {
        // 动态导入 node-fetch
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

        const whoisResponse = await fetch(`https://whois.freeaiapi.xyz/?name=${name}&suffix=${suffix}`);
        const whoisData = await whoisResponse.json();

        if (whoisData.status === 'ok' && whoisData.available === false) {
            res.json({
                isRegistered: true,
                registrationDate: whoisData.creation_datetime,
                expiryDate: whoisData.expiry_datetime, // 域名到期时间
                whoisInfo: whoisData.info, // WHOIS 详细信息
                // 您可以继续添加其他需要的字段...
            });
        } else {
            res.json({ isRegistered: false });
        }
    } catch (error) {
        console.error('Error fetching WHOIS data:', error);
        res.status(500).json({ error: '内部服务器错误' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
