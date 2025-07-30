"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CheckIcon from "@/components/icons/CheckIcon";

export default function ElectionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingLoading, setVotingLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch election and its candidates from API
        const response = await fetch(`/api/elections/${params.id}/candidates`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch election details');
        }

        if (data.success) {
          setElection(data.election);
          setCandidates(data.candidates);
        } else {
          throw new Error(data.error || 'Failed to fetch election details');
        }
      } catch (err) {
        setError(err.message || "Failed to fetch election details. Please try again later.");
        console.error("Error fetching election details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchElectionDetails();
    }
  }, [params.id]);

  const handleVote = async (candidateId) => {
    try {
      setVotingLoading(true);

      const response = await fetch(`/api/elections/${params.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId,
          // For now, we'll vote without authentication
          // In a real app, you'd get the voter ID from authentication
          voterId: null
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Vote cast successfully!');
        setHasVoted(true);
        // Refresh candidates to show updated vote counts
        const candidatesResponse = await fetch(`/api/elections/${params.id}/candidates`);
        const candidatesData = await candidatesResponse.json();
        if (candidatesData.success) {
          setCandidates(candidatesData.candidates);
        }
      } else {
        alert(result.error || 'Failed to cast vote');
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Failed to cast vote. Please try again.');
    } finally {
      setVotingLoading(false);
    }
  };

  // Format date for better display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if user is eligible to vote (mock function)
  const isEligibleToVote = () => {
    // TODO: Replace with actual eligibility check from API
    return true;
  };

  if (loading) {
    return (
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600 mt-4">Loading election details...</p>
        </div>
      </main>
    );
  }

  if (error || !election) {
    return (
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error || "Election not found"}</p>
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
    <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Election Header */}
        <Card className="mb-8 bg-white shadow-md">
          <CardContent className="p-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              {election.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600">{election.description}</p>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900">Election Details</h3>
              <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-600">Start Date</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDate(election.startDate)}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-600">End Date</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDate(election.endDate)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-600">Status</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (election.status === 'active' || election.status === 'ongoing') ? 'bg-green-100 text-green-800' :
                      election.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {(election.status === 'active' || election.status === 'ongoing') ? 'Active' : 
                       election.status === 'upcoming' ? 'Upcoming' : 
                       'Ended'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Candidates</h3>
          
          {candidates.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">No candidates registered for this election yet.</p>
                <Link href="/candidate/registration">
                  <Button>Register as Candidate</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate) => (
                <Card
                  key={candidate._id}
                  className="overflow-hidden bg-white shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  {candidate.image ? (
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url("${candidate.image}")` }}
                    />
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-600">{candidate.party || 'Independent'}</p>
                        {candidate.age && <p className="text-sm text-gray-600">Age: {candidate.age}</p>}
                        {candidate.education && <p className="text-sm text-gray-600">Education: {candidate.education}</p>}
                        {candidate.experience && <p className="text-sm text-gray-600">Experience: {candidate.experience}</p>}
                        {candidate.manifesto && (
                          <p className="text-sm text-gray-600 mt-2">Manifesto: {candidate.manifesto}</p>
                        )}
                        <p className="text-sm font-semibold text-blue-600 mt-2">Votes: {candidate.votes || 0}</p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-full py-2 text-sm font-semibold"
                          asChild
                        >
                          <Link href={`/candidate/${candidate._id}`}>View Profile</Link>
                        </Button>
                        {(election.status === "active" || election.status === "ongoing") && isEligibleToVote() && !hasVoted && (
                          <Button
                            className="flex-1 rounded-full py-2 text-sm font-bold bg-green-600 hover:bg-green-700 transition-colors"
                            onClick={() => handleVote(candidate._id)}
                            disabled={votingLoading}
                          >
                            {votingLoading ? 'Voting...' : 'Vote'}
                          </Button>
                        )}
                        {hasVoted && (
                          <div className="flex-1 flex items-center justify-center text-green-600">
                            <CheckIcon className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Voted!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Status Information */}
        {election.status === "completed" && (
          <Card className="bg-gray-50 shadow-md mb-8">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-gray-100 p-3 text-gray-600">
                  <CheckIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">This election has ended</p>
                  <p className="text-sm text-gray-600">Voting closed on {formatDate(election.endDate)}</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-2 rounded-full px-8 py-3 text-base font-bold tracking-wider"
                  onClick={() => router.push(`/election-details/${election._id}/results`)}
                >
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {election.status === "upcoming" && (
          <Card className="bg-yellow-50 shadow-md mb-8">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                  <CheckIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">This election has not started yet</p>
                  <p className="text-sm text-gray-600">
                    Voting begins on {formatDate(election.startDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {election.status === "active" && !isEligibleToVote() && (
          <Card className="bg-red-50 shadow-md mb-8">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-red-100 p-3 text-red-600">
                  <CheckIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">You are not eligible to vote</p>
                  <p className="text-sm text-gray-600">Please check the eligibility requirements above</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
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
