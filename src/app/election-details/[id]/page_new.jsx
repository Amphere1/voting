'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { checkAuthStatus, redirectToLogin } from '@/lib/authUtils';

export default function ElectionDetails() {
  const params = useParams();
  const router = useRouter();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [voting, setVoting] = useState(null); // Track which candidate is being voted for

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await checkAuthStatus();
      if (authStatus.isAuthenticated) {
        setUser(authStatus.user);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        setLoading(true);
        
        // Fetch election details
        const electionResponse = await fetch(`/api/elections/${params.id}`);
        if (!electionResponse.ok) {
          throw new Error('Failed to fetch election');
        }
        const electionData = await electionResponse.json();
        setElection(electionData);

        // Fetch candidates for this election
        const candidatesResponse = await fetch(`/api/elections/${params.id}/candidates`);
        if (!candidatesResponse.ok) {
          throw new Error('Failed to fetch candidates');
        }
        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData.candidates || []);
        
      } catch (error) {
        console.error('Error fetching election data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchElectionData();
    }
  }, [params.id]);

  const handleVote = async (candidateId) => {
    // Check authentication first
    if (!user) {
      alert('Please log in to vote');
      redirectToLogin();
      return;
    }

    // Check if user has voter role
    if (user.role !== 'voter') {
      alert('Only registered voters can cast votes');
      return;
    }

    // Check if user has already voted in this election
    if (user.votedElections && user.votedElections.includes(params.id)) {
      alert('You have already voted in this election');
      return;
    }

    try {
      setVoting(candidateId);
      
      const response = await fetch(`/api/elections/${params.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ candidateId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Vote cast successfully!');
        
        // Update user's voted elections
        setUser(prev => ({
          ...prev,
          votedElections: [...(prev.votedElections || []), params.id]
        }));
        
        // Refresh candidates to show updated vote counts
        const candidatesResponse = await fetch(`/api/elections/${params.id}/candidates`);
        if (candidatesResponse.ok) {
          const candidatesData = await candidatesResponse.json();
          setCandidates(candidatesData.candidates || []);
        }
      } else {
        alert(data.error || 'Failed to cast vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to cast vote. Please try again.');
    } finally {
      setVoting(null);
    }
  };

  const viewCandidate = (candidateId) => {
    router.push(`/candidate/${candidateId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading election details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Election not found</div>
      </div>
    );
  }

  const hasUserVoted = user && user.votedElections && user.votedElections.includes(params.id);
  const canVote = (election.status === 'active' || election.status === 'ongoing') && user && user.role === 'voter' && !hasUserVoted;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{election.title}</CardTitle>
              <CardDescription className="text-lg mt-2">
                {election.description}
              </CardDescription>
            </div>
            <Badge 
              variant={election.status === 'active' || election.status === 'ongoing' ? 'default' : 'secondary'}
              className="text-sm"
            >
              {election.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Start Date:</strong><br />
              {new Date(election.startDate).toLocaleDateString()}
            </div>
            <div>
              <strong>End Date:</strong><br />
              {new Date(election.endDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Total Candidates:</strong><br />
              {candidates.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {!user && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-yellow-800">
              You must be logged in as a voter to participate in this election.{' '}
              <button 
                onClick={redirectToLogin}
                className="underline font-medium hover:text-yellow-900"
              >
                Click here to log in
              </button>
            </p>
          </CardContent>
        </Card>
      )}

      {user && user.role !== 'voter' && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">
              Only registered voters can participate in elections. Your account role is: {user.role}
            </p>
          </CardContent>
        </Card>
      )}

      {hasUserVoted && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-800">
              You have already voted in this election. Thank you for participating!
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Candidates</h2>
        {candidates.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No candidates registered for this election yet.</p>
            </CardContent>
          </Card>
        ) : (
          candidates.map((candidate) => (
            <Card key={candidate._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {candidate.image && (
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">{candidate.name}</h3>
                        {candidate.party && (
                          <p className="text-gray-600">{candidate.party}</p>
                        )}
                      </div>
                      <Badge variant="outline">
                        {candidate.votes || 0} votes
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      {candidate.age && <p><strong>Age:</strong> {candidate.age}</p>}
                      {candidate.qualification && <p><strong>Qualification:</strong> {candidate.qualification}</p>}
                      {candidate.experience && <p><strong>Experience:</strong> {candidate.experience}</p>}
                    </div>

                    {candidate.manifesto && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">Manifesto:</p>
                        <p className="text-sm text-gray-600 mt-1">{candidate.manifesto}</p>
                      </div>
                    )}

                    <Separator className="my-4" />
                    
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewCandidate(candidate._id)}
                      >
                        View Profile
                      </Button>
                      
                      {canVote && (
                        <Button
                          size="sm"
                          onClick={() => handleVote(candidate._id)}
                          disabled={voting === candidate._id}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {voting === candidate._id ? 'Voting...' : 'Vote'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
