"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { checkAuthStatus, redirectToLogin } from '@/lib/authUtils';
import CheckIcon from "@/components/icons/CheckIcon";

export default function CandidatePage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingLoading, setVotingLoading] = useState(false);
  const [user, setUser] = useState(null);

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
    const fetchCandidateDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch candidate details from API
        const response = await fetch(`/api/candidate/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch candidate details');
        }

        if (data.success) {
          setCandidate(data.candidate);
        } else {
          throw new Error(data.error || 'Failed to fetch candidate details');
        }
      } catch (err) {
        setError(err.message || "Failed to fetch candidate details. Please try again later.");
        console.error("Error fetching candidate details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCandidateDetails();
    }
  }, [params.id]);

  const handleVote = async () => {
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

    if (!candidate.electionId) {
      alert('This candidate is not associated with any active election.');
      return;
    }

    // Check if user has already voted in this election
    if (user.votedElections && user.votedElections.includes(candidate.electionId)) {
      alert('You have already voted in this election');
      return;
    }

    try {
      setVotingLoading(true);

      const response = await fetch(`/api/elections/${candidate.electionId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          candidateId: candidate._id,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Vote cast successfully for ${candidate.name}! 🗳️\n\nThank you for participating in the democratic process.`);
        
        // Update user's voted elections
        setUser(prev => ({
          ...prev,
          votedElections: [...(prev.votedElections || []), candidate.electionId]
        }));
        
        // Refresh candidate data to show updated vote count
        const candidateResponse = await fetch(`/api/candidate/${params.id}`);
        const candidateData = await candidateResponse.json();
        if (candidateData.success) {
          setCandidate(candidateData.candidate);
        }
      } else {
        alert(`Failed to cast vote: ${result.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote. Please check your connection and try again.');
    } finally {
      setVotingLoading(false);
    }
  };

  const handleContact = () => {
    if (candidate.email) {
      window.location.href = `mailto:${candidate.email}?subject=Campaign Inquiry for ${candidate.name}`;
    } else {
      alert(`Contact information for ${candidate.name} is not available at this time. Please check back later or visit the campaign office.`);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-1 justify-center bg-gray-50 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading candidate profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !candidate) {
    return (
      <main className="flex flex-1 justify-center bg-gray-50 py-12">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error || "Candidate not found"}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()}>Go Back</Button>
            <Button variant="outline" onClick={() => router.push("/elections")}>
              View All Elections
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center bg-gray-50 py-12">
      <div className="w-full max-w-5xl space-y-12 px-4">
        {/* Candidate Profile Header */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-8 flex-col md:flex-row">
              {candidate.image ? (
                <div 
                  className="h-40 w-40 flex-shrink-0 rounded-full bg-cover bg-center bg-no-repeat shadow-md mx-auto md:mx-0" 
                  style={{ backgroundImage: `url("${candidate.image}")` }}
                />
              ) : (
                <div className="h-40 w-40 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center shadow-md mx-auto md:mx-0">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
              <div className="flex-grow pt-4 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900">{candidate.name}</h1>
                <p className="mt-1 text-lg text-gray-600">{candidate.party}</p>
                {candidate.age && <p className="mt-1 text-md text-gray-500">Age: {candidate.age}</p>}
                <p className="mt-2 text-lg italic text-blue-700">"{candidate.slogan}"</p>
                {candidate.election && (
                  <div className="mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      candidate.election.status === 'active' ? 'bg-green-100 text-green-800' :
                      candidate.election.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Running for: {candidate.election.title}
                    </span>
                  </div>
                )}
                <p className="mt-2 text-lg font-semibold text-blue-600">Current Votes: {candidate.votes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column - Manifesto */}
          <div className="space-y-8 lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Manifesto</h2>
                <p className="text-base leading-relaxed text-gray-700">
                  {candidate.manifesto}
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
                <p className="text-base leading-relaxed text-gray-700">
                  {candidate.experience}
                </p>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
                <p className="text-base leading-relaxed text-gray-700">
                  {candidate.education}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Achievements & Actions */}
          <div className="space-y-8">
            {/* Key Achievements */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Achievements</h3>
                {candidate.achievements && candidate.achievements.length > 0 ? (
                  <ul className="space-y-3">
                    {candidate.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">
                          {achievement}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No achievements listed yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-blue-50 shadow-sm">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Support {candidate.name}</h3>
                <div className="space-y-3">
                  {!user && (
                    <div className="w-full p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                      <span className="font-medium">Please log in to vote</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-2" 
                        onClick={redirectToLogin}
                      >
                        Log In
                      </Button>
                    </div>
                  )}

                  {user && user.role !== 'voter' && (
                    <div className="w-full p-3 bg-red-100 text-red-800 rounded-lg">
                      <span className="font-medium">Only registered voters can vote</span>
                    </div>
                  )}

                  {user && user.votedElections && user.votedElections.includes(candidate.electionId) && (
                    <div className="w-full p-3 bg-green-100 text-green-800 rounded-lg flex items-center justify-center gap-2">
                      <CheckIcon className="w-5 h-5" />
                      <span className="font-medium">You have voted for {candidate.name}!</span>
                    </div>
                  )}

                  {candidate.election && (candidate.election.status === 'active' || candidate.election.status === 'ongoing') && 
                   user && user.role === 'voter' && 
                   !(user.votedElections && user.votedElections.includes(candidate.electionId)) && (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleVote}
                      disabled={votingLoading}
                    >
                      {votingLoading ? 'Casting Vote...' : `Vote for ${candidate.name} 🗳️`}
                    </Button>
                  )}
                  
                  {candidate.election && candidate.election.status === 'upcoming' && (
                    <div className="w-full p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                      <span className="font-medium">Voting opens soon for {candidate.election.title}</span>
                    </div>
                  )}
                  
                  {candidate.election && candidate.election.status === 'completed' && (
                    <div className="w-full p-3 bg-gray-100 text-gray-800 rounded-lg">
                      <span className="font-medium">Voting has ended for {candidate.election.title}</span>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContact}
                  >
                    Contact Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Campaign</h3>
                <div className="space-y-2">
                  {candidate.email && (
                    <Button 
                      variant="outline" 
                      className="w-full text-left justify-start"
                      onClick={() => window.location.href = `mailto:${candidate.email}`}
                    >
                      📧 Email: {candidate.email}
                    </Button>
                  )}
                  {candidate.twitter && (
                    <Button 
                      variant="outline" 
                      className="w-full text-left justify-start"
                      onClick={() => window.open(candidate.twitter, '_blank')}
                    >
                      🐦 Twitter
                    </Button>
                  )}
                  {candidate.facebook && (
                    <Button 
                      variant="outline" 
                      className="w-full text-left justify-start"
                      onClick={() => window.open(candidate.facebook, '_blank')}
                    >
                      📘 Facebook
                    </Button>
                  )}
                  {candidate.website && (
                    <Button 
                      variant="outline" 
                      className="w-full text-left justify-start"
                      onClick={() => window.open(candidate.website, '_blank')}
                    >
                      🌐 Website
                    </Button>
                  )}
                  {!candidate.email && !candidate.twitter && !candidate.facebook && !candidate.website && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No social media links available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => router.back()}>
            ← Go Back
          </Button>
          <Button variant="outline" onClick={() => router.push("/elections")}>
            View All Elections
          </Button>
        </div>
      </div>
    </main>
  );
}
