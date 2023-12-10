document.getElementById('checkButton').addEventListener('click', function() {
    var domain = document.getElementById('domainInput').value;
    var resultDiv = document.getElementById('result'); // 确保在使用前定义了 resultDiv

    if (domain) {
        fetch('/api/check-domain?domain=' + encodeURIComponent(domain))
            .then(response => response.json())
            .then(data => {
                if (data.isRegistered) {
                    resultDiv.innerHTML = '<strong>域名已注册。</strong><br>' +
                                          '注册时间: ' + data.registrationDate + '<br>' +
                                          '到期时间: ' + data.expiryDate + '<br>' +
                                          'WHOIS 信息: <pre>' + data.whoisInfo + '</pre>';
                } else {
                    resultDiv.innerHTML = '<strong>域名未注册。</strong>';
                }
                resultDiv.style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                resultDiv.innerHTML = '查询出错，请稍后再试。'; // 确保这里使用了 resultDiv
                resultDiv.style.display = 'block';
            });
    }
});
