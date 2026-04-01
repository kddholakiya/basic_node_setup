# create-tk-node-app

A powerful CLI tool to scaffold Node.js projects with multiple template options including JavaScript, TypeScript, and encrypted variants.

## Features

- 🚀 Quick project scaffolding
- 🔐 Password-protected CLI access
- 📝 Multiple template options:
  - JavaScript
  - TypeScript
  - JavaScript (Encrypted)
  - TypeScript (Encrypted)
- 🎨 Beautiful CLI interface with colors and spinners
- 📦 Ready-to-use project structure

## Installation

```bash
npx create-tk-node-app
```

## Usage

### Create a new project

```bash
create-tk-node-app
```

### Follow the prompts

1. **Enter CLI password** - Authenticate to use the CLI
2. **Project name** - Name your new project
3. **Select template** - Choose from available templates

## Available Templates

| Template | Description | Features |
|----------|-------------|-----------|
| JavaScript | Standard JavaScript project | Express, MongoDB, JWT auth |
| TypeScript | TypeScript project | All JS features + TypeScript support |
| JavaScript (Encrypted) | JavaScript with encryption | Built-in payload encryption/decryption |
| TypeScript (Encrypted) | TypeScript with encryption | All features + encryption + TypeScript |

## Project Structure

Each generated project includes:

```
my-app/
├── bin/
│   └── www.js              # Server entry point
├── controllers/
│   ├── admin.controller.js   # Admin logic
│   └── auth.controller.js   # Authentication logic
├── helpers/
│   ├── common.js           # Common utilities
│   ├── Crypto.js           # Encryption utilities (encrypted templates)
│   └── validations/
│       └── user/
│           └── user.validate.js  # Input validation
├── model/
│   ├── user.js            # User model
│   ├── userLogin.js       # User session model
│   └── country_state_cities.js  # Location data
├── routes/
│   └── v1/
│       ├── admin.route.js   # Admin routes
│       ├── auth.route.js    # Auth routes
│       └── v1.js         # Route aggregator
├── services/
│   ├── admin.service.js    # Admin business logic
│   └── auth.service.js    # Auth business logic
├── seeder/
│   ├── seeder.js         # Database seeder
│   └── user.seeder.js    # User data seeder
├── views/
│   └── EmailTemplate/
│       └── verification.ejs  # Email templates
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore file
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

## Getting Started

After creating your project:

```bash
cd your-project-name
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

Configure your `.env` file with:

```env
# Server
NODE_ENV=local
PORT=4000
HOST=http://localhost

# Database
DB_URL=mongodb://localhost:27017/your-database-name

# JWT Authentication
JWT_EXPIRATION=2h

# Header Keys
WebKey=your-web-key
mobileKey=your-mobile-key

# Socket Host
socketHost=http://localhost:4000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Run database seeders

## Features Included

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Login/Logout functionality
- Password reset
- Token refresh

### Security
- Request payload encryption/decryption (encrypted templates)
- Rate limiting
- CORS configuration
- Input validation

### Database
- MongoDB integration with Mongoose
- User management
- Session tracking
- Location data (countries, states, cities)

### API Endpoints

#### Authentication Routes
- `POST /api/v1/auth/login` - User login
- `PUT /api/v1/auth/changepassword` - Change password
- `PUT /api/v1/auth/editprofile` - Update profile
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgetpassword` - Forgot password
- `PUT /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/refreshtoken` - Refresh JWT token

#### Admin Routes
- `POST /api/v1/admin/createuser` - Create new user (admin only)

## Development

### Prerequisites
- Node.js 18+
- MongoDB
- npm

### Local Development

```bash
git clone https://github.com/your-username/create-tk-node-app.git
cd create-tk-node-app
npm install
npm link
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/create-tk-node-app/issues) page
2. Create a new issue with detailed information
3. Join our [Discord](https://discord.gg/your-invite) community

## Changelog

### v1.0.2
- Fixed template path issues
- Updated environment variable examples
- Improved error handling

### v1.0.1
- Initial release
- Basic scaffolding functionality
- Password protection
- Multiple template support

---

**Made with ❤️ by the create-tk-node-app team**
