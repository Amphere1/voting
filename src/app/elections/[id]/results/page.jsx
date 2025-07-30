"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ElectionResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
    
    // Auto-refresh results every 30 seconds for active elections
    const interval = setInterval(() => {
      if (results && results.election.status === 'active') {
        fetchResults();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [params.id]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/elections/${params.id}/results`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch results');
      }
    } catch (err) {
      setError('Failed to load election results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressBarColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600'; // Gold
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500'; // Silver
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-800'; // Bronze
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading election results...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !results) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error || "Results not found"}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.back()}>Go Back</Button>
              <Button variant="outline" onClick={() => router.push("/elections")}>
                View All Elections
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {results.election.title} - Results
          </h1>
          <p className="text-lg text-gray-600 mb-4">{results.election.description}</p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Badge className={`px-3 py-1 text-sm font-medium ${getStatusColor(results.election.status)}`}>
              {results.election.status.charAt(0).toUpperCase() + results.election.status.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDate(results.election.startDate)} - {formatDate(results.election.endDate)}
            </span>
          </div>
          {results.election.status === 'active' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg inline-block">
              <p className="text-blue-700 text-sm">
                🔄 Results are updating in real-time • Last updated: {formatDate(results.lastUpdated)}
              </p>
            </div>
          )}
        </div>

        {/* Winner Announcement */}
        {results.winner && results.isComplete && (
          <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Election Winner</h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                {results.winner.image && (
                  <img 
                    src={results.winner.image} 
                    alt={results.winner.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-yellow-400"
                  />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{results.winner.name}</h3>
                  <p className="text-lg text-gray-600">{results.winner.party}</p>
                </div>
              </div>
              <div className="text-xl font-semibold text-yellow-700">
                {results.winner.votes.toLocaleString()} votes ({results.winner.percentage}%)
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.statistics.totalVotes.toLocaleString()}
              </div>
              <p className="text-gray-600">Total Votes Cast</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.statistics.turnoutPercentage}%
              </div>
              <p className="text-gray-600">Voter Turnout</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {results.statistics.candidateCount}
              </div>
              <p className="text-gray-600">Candidates</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {results.statistics.votersWhoVoted.toLocaleString()}
              </div>
              <p className="text-gray-600">Voters Participated</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Candidate Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.candidates.map((candidate, index) => (
                <div key={candidate._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-500 min-w-[3rem]">
                        {getRankIcon(candidate.rank)}
                      </div>
                      {candidate.image ? (
                        <img 
                          src={candidate.image} 
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-gray-600">{candidate.party}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {candidate.votes.toLocaleString()}
                      </div>
                      <div className="text-lg text-gray-600">
                        {candidate.percentage}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-1000 ${getProgressBarColor(candidate.rank)}`}
                        style={{ width: `${candidate.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Manifesto Preview */}
                  {candidate.manifesto && (
                    <div className="text-sm text-gray-600 line-clamp-2">
                      <strong>Platform:</strong> {candidate.manifesto}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Turnout Details */}
        <Card>
          <CardHeader>
            <CardTitle>Voter Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Registered Voters:</span>
                <span className="font-semibold">{results.statistics.totalRegisteredVoters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Votes Cast:</span>
                <span className="font-semibold">{results.statistics.votersWhoVoted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Turnout Rate:</span>
                <span className="font-semibold text-green-600">{results.statistics.turnoutPercentage}%</span>
              </div>
              
              {/* Turnout Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${results.statistics.turnoutPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push(`/election-details/${params.id}`)}>
            View Election Details
          </Button>
          <Button variant="outline" onClick={() => router.push("/elections")}>
            All Elections
          </Button>
          <Button variant="outline" onClick={fetchResults}>
            Refresh Results
          </Button>
        </div>
      </div>
    </main>
  );
}
