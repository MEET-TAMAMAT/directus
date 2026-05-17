// Test our hook logic without full Directus setup
console.log('Testing hide-modules hook logic...');

// Import our hook
import hookModule from './extensions/hooks/hide-modules/index.js';

// Mock Directus hook system
const mockFilter = (eventName, callback) => {
	console.log(`✅ Filter registered for: ${eventName}`);

	// Simulate settings.read event
	if (eventName === 'settings.read') {
		console.log('\n🔍 Testing settings.read filter...');

		// Mock settings data
		const mockItems = [
			{
				module_bar: [
					{ type: 'module', id: 'content', enabled: true },
					{ type: 'module', id: 'users', enabled: true }, // User Directory
					{ type: 'module', id: 'insights', enabled: true }, // Insights
					{ type: 'module', id: 'files', enabled: true },
					{ type: 'module', id: 'docs', enabled: true }, // Documentation
				],
			},
		];

		// Mock context for Sales Rep
		const mockContext = {
			accountability: {
				admin: false,
				role: '4c38ceb1-1d23-409b-9d51-66edbdd97fba', // Sales Rep role ID
			},
		};

		console.log('📋 Original module_bar:', JSON.stringify(mockItems[0].module_bar, null, 2));

		// Execute our filter
		const result = callback(mockItems, {}, mockContext);

		console.log('📋 Filtered module_bar:', JSON.stringify(result[0].module_bar, null, 2));
	}
};

// Mock hook registration
const mockHookSystem = { filter: mockFilter };

try {
	// Initialize our hook
	hookModule(mockHookSystem);
	console.log('\n✅ Hook test completed successfully!');
} catch (error) {
	console.error('\n❌ Hook test failed:', error);
}
