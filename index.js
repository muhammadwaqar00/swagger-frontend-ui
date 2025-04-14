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
app.post('/api/v1/user/signup', (req, res) => {
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
app.post('/api/v1/user/login', (req, res) => {
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
app.get('/api/v1/user/profile', verifyToken, (req, res) => {
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
				socialAccounts: {
					google: false,
					apple: false,
				},
			},
		},
	});
});

// Protected profile update API endpoint
app.put('/api/v1/user/profile', verifyToken, (req, res) => {
	const { firstName, lastName, nationality, gender, dateOfBirth } = req.body;
	res.status(200).json({
		success: true,
		message: 'Profile updated successfully',
		data: {
			user: {
				id: Math.floor(Math.random() * 1000) + 1,
				email: 'user@example.com',
				firstName: firstName || 'John',
				lastName: lastName || 'Doe',
				phoneNumberCode: '+1',
				phoneNumber: '2345678901',
				isEmailVerified: false,
				isPhoneVerified: false,
				createdAt: new Date().toISOString(),
				nationality: nationality || 'US',
				gender: gender || 'male',
				dateOfBirth: dateOfBirth || '1990-01-01',
			},
		},
	});
});

// New social login API endpoint
app.post('/api/v1/user/social-login', (req, res) => {
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

// Protected social account linking API endpoint
app.post('/api/v1/user/social-link', verifyToken, (req, res) => {
	const { provider, token } = req.body;
	if (!['google', 'apple'].includes(provider)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid provider',
			data: {},
		});
	}
	res.status(200).json({
		success: true,
		message: 'Social account linked successfully',
		data: {},
	});
});

// Forgot password API endpoint
app.post('/api/v1/user/forgot-password', (req, res) => {
	const { email } = req.body;
	res.status(200).json({
		success: true,
		message: 'Password reset link sent successfully',
		data: {},
	});
});

// Verify reset token API endpoint
app.post('/api/v1/user/verify-reset-token', (req, res) => {
	const { token, email } = req.body;
	res.status(200).json({
		success: true,
		message: 'Token verified successfully',
		data: {},
	});
});

// Reset password API endpoint
app.post('/api/v1/user/reset-password', (req, res) => {
	const { token, email, newPassword } = req.body;
	res.status(200).json({
		success: true,
		message: 'Password reset successful',
		data: {},
	});
});

// Protected verify email API endpoint
app.post('/api/v1/user/verify-email', verifyToken, (req, res) => {
	const { token } = req.body;
	res.status(200).json({
		success: true,
		message: 'Email verified successfully',
		data: {},
	});
});

// Protected verify phone API endpoint
app.post('/api/v1/user/verify-phone', verifyToken, (req, res) => {
	const { otp } = req.body;
	res.status(200).json({
		success: true,
		message: 'Phone verified successfully',
		data: {},
	});
});

// Protected password update API endpoint
app.put('/api/v1/user/password', verifyToken, (req, res) => {
	const { currentPassword, newPassword } = req.body;
	res.status(200).json({
		success: true,
		message: 'Password changed successfully',
		data: {},
	});
});

// Protected language preference API endpoint
app.put('/api/v1/user/language', verifyToken, (req, res) => {
	const { language } = req.body;
	if (!['en', 'ar'].includes(language)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid language code',
			data: {},
		});
	}
	res.status(200).json({
		success: true,
		message: 'Language preference updated successfully',
		data: {},
	});
});

// Protected notification settings fetch API endpoint
app.get('/api/v1/user/notification-settings', verifyToken, (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Notification settings retrieved successfully',
		data: {
			feedback: true,
			consultations: true,
			legacyAndFamilyRecords: true,
			paymentAndSubscription: true,
			securityAndAccount: true,
			generalUpdates: true,
		},
	});
});

// Protected notification settings update API endpoint
app.patch('/api/v1/user/notification-settings', verifyToken, (req, res) => {
	const settings = req.body;
	res.status(200).json({
		success: true,
		message: 'Notification settings updated successfully',
		data: {
			...settings,
		},
	});
});

// Protected feedback submission endpoint
app.post('/api/v1/user/feedback', verifyToken, (req, res) => {
	const { subject, message, fileAttachments } = req.body;
	res.status(201).json({
		success: true,
		message: 'Feedback submitted successfully',
		data: {},
	});
});

// Mock data for educational resources
const educationalResources = Array(20)
	.fill(null)
	.map((_, index) => ({
		id: index + 1,
		title: `Educational Resource ${index + 1}`,
		description: `This is a detailed description for educational resource ${
			index + 1
		}`,
		imageUrl: `https://example.com/images/resource-${index + 1}.jpg`,
		isFeatured: index < 5, // First 5 items are featured
		createdAt: new Date().toISOString(),
	}));

// Get featured educational resources
app.get('/api/v1/educational-resources/featured', verifyToken, (req, res) => {
	const featuredResources = educationalResources
		.filter((resource) => resource.isFeatured)
		.slice(0, 5);

	res.status(200).json({
		success: true,
		message: 'Featured resources retrieved successfully',
		data: {
			resources: featuredResources,
		},
	});
});

// Search and list educational resources with pagination
app.get('/api/v1/educational-resources', verifyToken, (req, res) => {
	const search = req.query.search?.toLowerCase() || '';
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	// Filter resources based on search term
	const filteredResources = educationalResources.filter(
		(resource) =>
			resource.title.toLowerCase().includes(search) ||
			resource.description.toLowerCase().includes(search)
	);

	// Calculate pagination
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedResources = filteredResources.slice(startIndex, endIndex);

	res.status(200).json({
		success: true,
		message: 'Resources retrieved successfully',
		data: {
			resources: paginatedResources,
			total: filteredResources.length,
		},
	});
});

// Mock data for workshops
const workshops = Array(20)
	.fill(null)
	.map((_, index) => ({
		id: index + 1,
		title: `Workshop ${index + 1}`,
		description: `This is a detailed description for workshop ${index + 1}`,
		mediaType: index % 3 === 0 ? 'video' : 'image', // Every 3rd item is a video
		mediaUrl:
			index % 3 === 0
				? `https://example.com/videos/workshop-${index + 1}.mp4`
				: `https://example.com/images/workshop-${index + 1}.jpg`,
		startDate: new Date(
			Date.now() + index * 24 * 60 * 60 * 1000
		).toISOString(), // Each workshop starts a day after the previous
		endDate: new Date(
			Date.now() + (index + 1) * 24 * 60 * 60 * 1000
		).toISOString(),
		isUpcoming: index < 5, // First 5 items are upcoming
		createdAt: new Date().toISOString(),
	}));

// Get upcoming workshops
app.get('/api/v1/workshops/upcoming', verifyToken, (req, res) => {
	const upcomingWorkshops = workshops
		.filter((workshop) => workshop.isUpcoming)
		.slice(0, 5);

	res.status(200).json({
		success: true,
		message: 'Upcoming workshops retrieved successfully',
		data: {
			workshops: upcomingWorkshops,
		},
	});
});

// Search and list workshops with pagination
app.get('/api/v1/workshops', verifyToken, (req, res) => {
	const search = req.query.search?.toLowerCase() || '';
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;

	// Filter workshops based on search term
	const filteredWorkshops = workshops.filter(
		(workshop) =>
			workshop.title.toLowerCase().includes(search) ||
			workshop.description.toLowerCase().includes(search)
	);

	// Calculate pagination
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedWorkshops = filteredWorkshops.slice(startIndex, endIndex);

	res.status(200).json({
		success: true,
		message: 'Workshops retrieved successfully',
		data: {
			workshops: paginatedWorkshops,
			total: filteredWorkshops.length,
		},
	});
});

// Protected dashboard API endpoint
app.get('/api/v1/dashboard', verifyToken, (req, res) => {
	// Get random featured resources (3 items)
	const featuredResources = educationalResources
		.filter((resource) => resource.isFeatured)
		.slice(0, 3);

	res.status(200).json({
		success: true,
		message: 'Dashboard data retrieved successfully',
		data: {
			willStatus: {
				completionPercentage: 75, // Mock percentage
				isCompleted: true, // Mock completion status
				stats: {
					totalNumberOfBeneficiaries: 5,
					totalAssets: 12,
					totalAssetsValue: 1500000,
					outstandingDebts: 50000,
				},
			},
			educationalResources: featuredResources,
		},
	});
});

app.listen(port, () => {
	console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
	console.log(`Server running on port ${port}`);
});
