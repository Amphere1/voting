"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminElectionResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchResults();
      
      // Auto-refresh every 15 seconds for real-time updates
      const interval = setInterval(fetchResults, 15000);
      return () => clearInterval(interval);
    }
  }, [params.id, isAuthenticated]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      
      if (data.success && data.user.role === 'admin') {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

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

  const exportResults = () => {
    if (!results) return;
    
    const csvData = [
      ['Rank', 'Candidate Name', 'Party', 'Votes', 'Percentage'],
      ...results.candidates.map(candidate => [
        candidate.rank,
        candidate.name,
        candidate.party,
        candidate.votes,
        `${candidate.percentage}%`
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${results.election.title.replace(/\s+/g, '_')}_results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated || loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">
                {!isAuthenticated ? "Verifying admin access..." : "Loading election results..."}
              </p>
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
              <Button onClick={() => router.push("/admin")}>Back to Admin Dashboard</Button>
              <Button variant="outline" onClick={fetchResults}>
                Retry
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
        {/* Admin Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Badge className="bg-red-100 text-red-800 px-3 py-1">ADMIN VIEW</Badge>
            <Badge className={`px-3 py-1 ${getStatusColor(results.election.status)}`}>
              {results.election.status.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {results.election.title} - Admin Results Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-4">{results.election.description}</p>
          <div className="flex justify-center items-center gap-4 flex-wrap text-sm text-gray-500">
            <span>{formatDate(results.election.startDate)} - {formatDate(results.election.endDate)}</span>
            <span>•</span>
            <span>Last Updated: {formatDate(results.lastUpdated)}</span>
            {results.election.status === 'active' && (
              <>
                <span>•</span>
                <span className="text-green-600 font-medium">🔄 Live Updates</span>
              </>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button onClick={exportResults} variant="outline">
            📊 Export CSV
          </Button>
          <Button onClick={fetchResults} variant="outline">
            🔄 Refresh Data
          </Button>
          <Button onClick={() => router.push(`/elections/${params.id}/results`)} variant="outline">
            👥 Public View
          </Button>
        </div>

        {/* Winner Announcement */}
        {results.winner && results.isComplete && (
          <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">WINNER DECLARED</h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                {results.winner.image && (
                  <img 
                    src={results.winner.image} 
                    alt={results.winner.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400"
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
              <div className="text-sm text-gray-600 mt-2">
                Victory Margin: {results.winner.votes - (results.candidates[1]?.votes || 0)} votes
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comprehensive Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-blue-50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.statistics.totalVotes.toLocaleString()}
              </div>
              <p className="text-gray-600">Total Votes Cast</p>
              <p className="text-xs text-gray-500 mt-1">
                Real-time count
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.statistics.turnoutPercentage}%
              </div>
              <p className="text-gray-600">Voter Turnout</p>
              <p className="text-xs text-gray-500 mt-1">
                {results.statistics.votersWhoVoted}/{results.statistics.totalRegisteredVoters} registered
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {results.statistics.candidateCount}
              </div>
              <p className="text-gray-600">Candidates</p>
              <p className="text-xs text-gray-500 mt-1">
                Total competing
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {results.candidates[0]?.votes - (results.candidates[1]?.votes || 0) || 0}
              </div>
              <p className="text-gray-600">Victory Margin</p>
              <p className="text-xs text-gray-500 mt-1">
                Vote difference
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Admin Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-between">
              <span>Detailed Results (Admin View)</span>
              <Badge variant="outline">{results.candidates.length} Candidates</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 font-semibold">Rank</th>
                    <th className="text-left p-4 font-semibold">Candidate</th>
                    <th className="text-left p-4 font-semibold">Party</th>
                    <th className="text-right p-4 font-semibold">Votes</th>
                    <th className="text-right p-4 font-semibold">Percentage</th>
                    <th className="text-center p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.candidates.map((candidate, index) => (
                    <tr key={candidate._id} className={`border-b hover:bg-gray-50 ${
                      candidate.rank === 1 ? 'bg-yellow-50' : ''
                    }`}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {candidate.rank === 1 ? '🥇' : candidate.rank === 2 ? '🥈' : candidate.rank === 3 ? '🥉' : `#${candidate.rank}`}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {candidate.image ? (
                            <img 
                              src={candidate.image} 
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold">{candidate.name}</div>
                            <div className="text-sm text-gray-500">ID: {candidate._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{candidate.party}</Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="text-lg font-semibold">
                          {candidate.votes.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="text-lg font-semibold">
                          {candidate.percentage}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              candidate.rank === 1 ? 'bg-yellow-500' : 
                              candidate.rank === 2 ? 'bg-gray-400' :
                              candidate.rank === 3 ? 'bg-amber-600' : 'bg-blue-500'
                            }`}
                            style={{ width: `${candidate.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {candidate.rank === 1 && results.isComplete && (
                          <Badge className="bg-green-100 text-green-800">Winner</Badge>
                        )}
                        {candidate.rank <= 3 && !results.isComplete && (
                          <Badge variant="outline">Leading</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Analytics */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Turnout Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Registered Voters:</span>
                  <span className="font-semibold">{results.statistics.totalRegisteredVoters.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Votes Cast:</span>
                  <span className="font-semibold">{results.statistics.votersWhoVoted.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Abstentions:</span>
                  <span className="font-semibold">
                    {(results.statistics.totalRegisteredVoters - results.statistics.votersWhoVoted).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Turnout Rate:</span>
                  <span className={`${results.statistics.turnoutPercentage > 50 ? 'text-green-600' : 'text-orange-600'}`}>
                    {results.statistics.turnoutPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${results.statistics.turnoutPercentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Competition Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Leading Candidate:</span>
                  <span className="font-semibold">{results.candidates[0]?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lead Margin:</span>
                  <span className="font-semibold">
                    {((results.candidates[0]?.votes || 0) - (results.candidates[1]?.votes || 0)).toLocaleString()} votes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Closest Race:</span>
                  <span className="font-semibold">
                    {Math.abs((results.candidates[1]?.percentage || 0) - (results.candidates[2]?.percentage || 0)).toFixed(1)}% gap
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Election Status:</span>
                  <Badge className={getStatusColor(results.election.status)}>
                    {results.election.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Button onClick={() => router.push("/admin")} variant="outline">
            ← Admin Dashboard
          </Button>
          <Button onClick={() => router.push(`/election-details/${params.id}`)} variant="outline">
            Election Details
          </Button>
          <Button onClick={() => router.push("/elections")} variant="outline">
            All Elections
          </Button>
        </div>
      </div>
    </main>
  );
}
