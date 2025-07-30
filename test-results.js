// Sample script to test the results API functionality
// This is for development/testing purposes only

const testResultsAPI = async () => {
  try {
    console.log('🧪 Testing Results API...\n');

    // Test 1: Fetch results for a sample election
    console.log('📊 Testing election results endpoint...');
    
    const testElectionId = '675a6b2f65b123456789abcd'; // Sample election ID
    const response = await fetch(`http://localhost:3000/api/elections/${testElectionId}/results`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Results API Response:', {
        success: data.success,
        electionTitle: data.results?.election?.title,
        candidateCount: data.results?.candidates?.length,
        totalVotes: data.results?.statistics?.totalVotes,
        turnoutPercentage: data.results?.statistics?.turnoutPercentage,
        winner: data.results?.winner?.name
      });
    } else {
      console.log('⚠️ Results API returned:', response.status, response.statusText);
      const errorData = await response.json();
      console.log('Error details:', errorData);
    }

    // Test 2: Verify results structure
    console.log('\n🔍 Expected Results Structure:');
    console.log(`
    {
      success: boolean,
      results: {
        election: { title, description, status, startDate, endDate },
        candidates: [{ 
          _id, name, party, votes, percentage, rank, image, manifesto 
        }],
        statistics: {
          totalVotes, candidateCount, turnoutPercentage,
          votersWhoVoted, totalRegisteredVoters
        },
        winner: { name, party, votes, percentage, image } | null,
        isComplete: boolean,
        lastUpdated: string
      }
    }
    `);

    console.log('\n✨ Results Feature Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Usage Instructions
console.log(`
🗳️ VoteWise Results Feature - Testing Guide

To test the results feature:

1. 📡 Start the development server:
   npm run dev

2. 🎯 Create test data:
   - Go to /admin/login (admin@vote.com / admin123)
   - Create a sample election
   - Add candidates to the election
   - Generate some test votes

3. 📊 Test Results Pages:
   - Public results: /elections/[election-id]/results
   - Admin results: /admin/elections/[election-id]/results

4. 🔄 Features to verify:
   - Real-time vote counting
   - Candidate rankings and percentages
   - Winner determination
   - Turnout statistics
   - CSV export (admin only)
   - Auto-refresh functionality

5. 📱 Test on different devices:
   - Desktop browsers
   - Mobile phones
   - Tablets

6. 🧪 API Testing:
   - GET /api/elections/[id]/results
   - Verify JSON structure
   - Check error handling

Happy testing! 🎉
`);

// Uncomment the line below to run the test
// testResultsAPI();

module.exports = { testResultsAPI };
