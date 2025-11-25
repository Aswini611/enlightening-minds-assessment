import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Search, Download, RefreshCw, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || sub.created_at.startsWith(dateFilter);

    return matchesSearch && matchesDate;
  });

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "DOB", "City", "Created At", "Top Domain"];
    const rows = filteredSubmissions.map((sub) => {
      const topDomain = sub.scores?.[0]?.domain || "N/A";
      return [
        sub.name,
        sub.email,
        sub.phone,
        sub.dob,
        sub.city,
        new Date(sub.created_at).toLocaleDateString(),
        topDomain,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mi-assessments-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("CSV exported successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage and review MI assessment submissions 🌐
          </p>
        </div>

        {/* Filters */}
        <Card className="shadow-medium border-none">
          <CardHeader>
            <CardTitle>Filters & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="md:w-48"
              />
              <Button
                onClick={fetchSubmissions}
                variant="outline"
                className="md:w-auto"
              >
                <RefreshCw className="mr-2 w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={exportToCSV}
                disabled={filteredSubmissions.length === 0}
                className="bg-gradient-success hover:opacity-90"
              >
                <Download className="mr-2 w-4 h-4" />
                Export CSV
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card className="shadow-large border-none">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Top Domain</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No submissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.phone}</TableCell>
                        <TableCell>
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-hero text-white">
                            {submission.scores?.[0]?.domain || "Processing..."}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/result/${submission.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" disabled>
                              <RefreshCw className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/">
            <Button variant="outline" size="lg" className="rounded-xl">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
