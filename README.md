# Encryption API

A Reversed Encryption API of Multiple Gateways

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/DevAniiii/ReversedEncryptor.git
cd ReversedEncryptor
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in root directory with:
```properties
MONGODB_URI=your_mongodb_connection_string
```

4. Start development server:
```bash
npm run dev
```

## 🛠️ Features

- **Multiple Encryption Versions**:
  - JWT (v4.4.1, v4.5.0)
  - CSE (v5.11.0)
- **Vantiv Encryption Support**
- **Risk Data Generation**
- **Real-time Analytics Dashboard**
- **Request Statistics**
- **CORS Enabled**

## 📡 API Endpoints

### Card Encryption
```javascript
POST /api/encrypt

{
  "card": "4242424242424242",
  "month": "12",
  "year": "2025",
  "cvc": "123",
  "adyenKey": "YOUR_PUBLIC_KEY",
  "version": "5.11.0"  // 4.4.1, 4.5.0, or 5.11.0
}
```

### Vantiv Encryption
```javascript
POST /api/vantiv

{
  "card": "4242424242424242",
  "month": "12",
  "year": "2025",
  "cvc": "123",
  "modulus": "YOUR_MODULUS"
}
```

## 🔧 Tech Stack

- Next.js 15.3.1
- React 19
- TailwindCSS 4
- Chart.js
- MongoDB
- Node-forge
- Random User Agent

## 📊 Dashboard Features

- Real-time request monitoring
- Usage statistics
- Success/failure rates
- Version distribution charts
- Geographic data visualization

## 🔒 Security

- No card data storage
- Encrypted transmission
- Rate limiting
- IP filtering
- Request validation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

[@DevAniiii](https://github.com/DevAniiii)
[@OriginalAni](https://t.me/OriginalAni)