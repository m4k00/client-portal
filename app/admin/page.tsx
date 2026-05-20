"use client";

import { trpc } from "@/lib/trpc-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { ComplexityIndicator } from "@/components/shared/complexity-indicator";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState<"new" | "reviewed" | "contacted" | "archived" | undefined>();

  const { data: stats, isLoading: statsLoading } = trpc.submissions.getStats.useQuery();
  const { data: submissions, isLoading: submissionsLoading } = trpc.submissions.getAll.useQuery({
    status: statusFilter,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Manage incoming project requests</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                New
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reviewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">{stats.reviewed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contacted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{stats.contacted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Archived
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Submissions</CardTitle>
            <Select
              value={statusFilter || "all"}
              onValueChange={(value) =>
                setStatusFilter(value === "all" ? undefined : (value as any))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : submissions && submissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Project Type</TableHead>
                  <TableHead>Complexity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} className="cursor-pointer">
                    <Link href={`/admin/leads/${submission.id}`} className="contents">
                      <TableCell>
                        <div>
                          <p className="font-medium">{submission.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.clientEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {submission.projectType.replace("-", " ")}
                      </TableCell>
                      <TableCell>
                        {submission.assessment ? (
                          <ComplexityIndicator
                            rating={submission.assessment.complexityRating}
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={submission.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(submission.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </Link>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No submissions {statusFilter ? `with status "${statusFilter}"` : "yet"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
