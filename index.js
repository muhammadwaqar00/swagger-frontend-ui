const express = require('express');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];
	if (!bearerHeader) {
		return res.status(401).json({
			success: false,
			message: 'No token provided',
		});
	}

	const bearer = bearerHeader.split(' ');
	const token = bearer[1];

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({
			success: false,
			message: 'Invalid token',
		});
	}
};

const swaggerDocument = require('./swagger.json');

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// New signup API endpoint
app.post('/api/signup', (req, res) => {
	const {
		email,
		firstName,
		lastName,
		phoneNumberCode,
		phoneNumber,
		password,
	} = req.body;

	const userId = Math.floor(Math.random() * 1000) + 1;
	const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' });

	res.status(201).json({
		success: true,
		message: 'User registered successfully',
		data: {
			user: {
				id: userId,
				email,
				firstName,
				lastName,
				phoneNumberCode,
				phoneNumber,
				isEmailVerified: false,
				isPhoneVerified: false,
				createdAt: new Date().toISOString(),
			},
			token,
		},
	});
});

// New login API endpoint
app.post('/api/login', (req, res) => {
	const { userName, password } = req.body;

	const userId = Math.floor(Math.random() * 1000) + 1;
	const token = jwt.sign({ userId, email: 'user@example.com' }, JWT_SECRET, {
		expiresIn: '24h',
	});

	res.status(200).json({
		success: true,
		message: 'User login successfully',
		data: {
			user: {
				id: userId,
				email: 'user@example.com', // Mock email since userName could be phone
				firstName: 'John',
				lastName: 'Doe',
				phoneNumberCode: '+1',
				phoneNumber: '2345678901',
				isEmailVerified: false,
				isPhoneVerified: false,
				createdAt: new Date().toISOString(),
			},
			token,
		},
	});
});

// Protected profile fetch API endpoint
app.get('/api/profile', verifyToken, (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Profile fetched successfully',
		data: {
			user: {
				id: Math.floor(Math.random() * 1000) + 1,
				email: 'user@example.com',
				firstName: 'John',
				lastName: 'Doe',
				phoneNumberCode: '+1',
				phoneNumber: '2345678901',
				isEmailVerified: false,
				isPhoneVerified: false,
				createdAt: new Date().toISOString(),
			},
		},
	});
});

// New social login API endpoint
app.post('/api/social-login', (req, res) => {
	const { provider, token } = req.body;
	res.status(200).json({
		success: true,
		message: 'User logged-in successfully',
		data: {
			user: {
				id: Math.floor(Math.random() * 1000) + 1,
				email: 'user@example.com',
				firstName: 'John',
				lastName: 'Doe',
				phoneNumberCode: '+1',
				phoneNumber: '2345678901',
				isEmailVerified: true,
				isPhoneVerified: false,
				createdAt: new Date().toISOString(),
			},
			token:
				'mock-jwt-token-' + Math.random().toString(36).substring(2, 15),
		},
	});
});

// Forgot password API endpoint
app.post('/api/forgot-password', (req, res) => {
	const { email } = req.body;
	res.status(200).json({
		success: true,
		message: 'Password reset link sent successfully',
	});
});

// Verify reset token API endpoint
app.post('/api/verify-reset-token', (req, res) => {
	const { token, email } = req.body;
	res.status(200).json({
		success: true,
		message: 'Token verified successfully',
	});
});

// Reset password API endpoint
app.post('/api/reset-password', (req, res) => {
	const { token, email, newPassword } = req.body;
	res.status(200).json({
		success: true,
		message: 'Password reset successful',
	});
});

// Protected verify email API endpoint
app.post('/api/verify-email', verifyToken, (req, res) => {
	const { token } = req.body;
	res.status(200).json({
		success: true,
		message: 'Email verified successfully',
	});
});

// Protected verify phone API endpoint
app.post('/api/verify-phone', verifyToken, (req, res) => {
	const { otp } = req.body;
	res.status(200).json({
		success: true,
		message: 'Phone verified successfully',
	});
});

app.listen(port, () => {
	console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
	console.log(`Server running on port ${port}`);
});
