"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { electionsData } from "@/config/electionsData";
import { candidatesData } from "@/config/candidatesData";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Election form state
  const [electionForm, setElectionForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
  });

  // Candidate form state
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    party: "",
    manifesto: "",
    experience: "",
    education: "",
    electionId: "",
  });

  useEffect(() => {
    // Load initial data
    setElections(electionsData);
    setCandidates(candidatesData);
  }, []);

  // Handle election form submission
  const handleCreateElection = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      const newElection = {
        id: Date.now().toString(),
        ...electionForm,
        createdAt: new Date().toISOString(),
        candidates: [],
      };

      setElections([...elections, newElection]);
      setElectionForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "upcoming",
      });

      alert("Election created successfully!");
    } catch (error) {
      console.error("Error creating election:", error);
      alert("Failed to create election. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle candidate form submission
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      const newCandidate = {
        id: Date.now().toString(),
        ...candidateForm,
        image: "/api/placeholder/150/150",
        votes: 0,
        achievements: [],
      };

      setCandidates([...candidates, newCandidate]);
      setCandidateForm({
        name: "",
        party: "",
        manifesto: "",
        experience: "",
        education: "",
        electionId: "",
      });

      alert("Candidate added successfully!");
    } catch (error) {
      console.error("Error adding candidate:", error);
      alert("Failed to add candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle election deletion
  const handleDeleteElection = (electionId) => {
    if (confirm("Are you sure you want to delete this election?")) {
      setElections(elections.filter(e => e.id !== electionId));
      // Also remove candidates from this election
      setCandidates(candidates.filter(c => c.electionId !== electionId));
    }
  };

  // Handle candidate removal
  const handleRemoveCandidate = (candidateId) => {
    if (confirm("Are you sure you want to remove this candidate?")) {
      setCandidates(candidates.filter(c => c.id !== candidateId));
    }
  };

  // Get election statistics
  const getStats = () => {
    return {
      totalElections: elections.length,
      activeElections: elections.filter(e => e.status === "ongoing").length,
      upcomingElections: elections.filter(e => e.status === "upcoming").length,
      totalCandidates: candidates.length,
      totalVotes: candidates.reduce((sum, c) => sum + (c.votes || 0), 0),
    };
  };

  const stats = getStats();

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "elections", label: "Manage Elections", icon: "🗳️" },
    { id: "candidates", label: "Manage Candidates", icon: "👥" },
    { id: "create-election", label: "Create Election", icon: "➕" },
    { id: "add-candidate", label: "Add Candidate", icon: "👤" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage elections, candidates, and monitor voting activities</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stats.totalElections}</p>
                      <p className="text-blue-100 text-sm">Total Elections</p>
                    </div>
                    <div className="text-3xl">🗳️</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stats.activeElections}</p>
                      <p className="text-green-100 text-sm">Active Elections</p>
                    </div>
                    <div className="text-3xl">🟢</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stats.upcomingElections}</p>
                      <p className="text-yellow-100 text-sm">Upcoming Elections</p>
                    </div>
                    <div className="text-3xl">⏰</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stats.totalCandidates}</p>
                      <p className="text-purple-100 text-sm">Total Candidates</p>
                    </div>
                    <div className="text-3xl">👥</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stats.totalVotes}</p>
                      <p className="text-indigo-100 text-sm">Total Votes</p>
                    </div>
                    <div className="text-3xl">📊</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Elections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {elections.slice(0, 5).map((election) => (
                    <div key={election.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{election.title}</h3>
                        <p className="text-sm text-gray-600">{election.description}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          election.status === "ongoing" 
                            ? "bg-green-100 text-green-800"
                            : election.status === "upcoming"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {election.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Manage Elections Tab */}
        {activeTab === "elections" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Elections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {elections.map((election) => (
                    <div key={election.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{election.title}</h3>
                        <p className="text-gray-600">{election.description}</p>
                        <div className="flex gap-4 text-sm text-gray-500 mt-2">
                          <span>Start: {new Date(election.startDate).toLocaleDateString()}</span>
                          <span>End: {new Date(election.endDate).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            election.status === "ongoing" 
                              ? "bg-green-100 text-green-700"
                              : election.status === "upcoming"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {election.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteElection(election.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Manage Candidates Tab */}
        {activeTab === "candidates" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">{candidate.party}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {candidate.manifesto}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Votes: {candidate.votes || 0}
                        </span>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveCandidate(candidate.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Election Tab */}
        {activeTab === "create-election" && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Election</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateElection} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Election Title *</Label>
                    <Input
                      id="title"
                      value={electionForm.title}
                      onChange={(e) => setElectionForm({...electionForm, title: e.target.value})}
                      placeholder="e.g., Presidential Election 2025"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={electionForm.status}
                      onValueChange={(value) => setElectionForm({...electionForm, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={electionForm.description}
                    onChange={(e) => setElectionForm({...electionForm, description: e.target.value})}
                    placeholder="Describe the election purpose and scope..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={electionForm.startDate}
                      onChange={(e) => setElectionForm({...electionForm, startDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={electionForm.endDate}
                      onChange={(e) => setElectionForm({...electionForm, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating..." : "Create Election"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Add Candidate Tab */}
        {activeTab === "add-candidate" && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Candidate</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCandidate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="candidateName">Candidate Name *</Label>
                    <Input
                      id="candidateName"
                      value={candidateForm.name}
                      onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                      placeholder="Full name of the candidate"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="party">Political Party *</Label>
                    <Input
                      id="party"
                      value={candidateForm.party}
                      onChange={(e) => setCandidateForm({...candidateForm, party: e.target.value})}
                      placeholder="e.g., Democratic Party"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="candidateElection">Election *</Label>
                  <Select
                    value={candidateForm.electionId}
                    onValueChange={(value) => setCandidateForm({...candidateForm, electionId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an election" />
                    </SelectTrigger>
                    <SelectContent>
                      {elections.map((election) => (
                        <SelectItem key={election.id} value={election.id}>
                          {election.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manifesto">Manifesto *</Label>
                  <Textarea
                    id="manifesto"
                    value={candidateForm.manifesto}
                    onChange={(e) => setCandidateForm({...candidateForm, manifesto: e.target.value})}
                    placeholder="Candidate's political vision and policies..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      value={candidateForm.experience}
                      onChange={(e) => setCandidateForm({...candidateForm, experience: e.target.value})}
                      placeholder="Professional and political experience..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={candidateForm.education}
                      onChange={(e) => setCandidateForm({...candidateForm, education: e.target.value})}
                      placeholder="Educational background..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Adding..." : "Add Candidate"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}