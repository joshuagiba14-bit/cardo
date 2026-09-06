import type { LeadDTO, LeadStatus, PaginatedData } from "@cardo/shared";
import { apiFetchServer } from "@/lib/api-server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeadsFilterBar } from "@/components/admin/leads-filter-bar";
import { LeadStatusCell } from "@/components/admin/lead-status-cell";
import { PaginationBar } from "@/components/admin/pagination-bar";

type PageProps = {
  searchParams: Promise<{ status?: string; page?: string }>;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const { status, page } = await searchParams;
  const pageNumber = Number(page ?? "1") || 1;

  const query = new URLSearchParams({ page: String(pageNumber), pageSize: "20" });
  if (status) query.set("status", status);

  const res = await apiFetchServer<PaginatedData<LeadDTO>>(`/api/leads?${query.toString()}`);
  const data = res.ok ? res.data : { items: [], page: 1, pageSize: 20, total: 0, totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2">Leads</h1>
          <p className="text-small text-muted-foreground">{data.total} total</p>
        </div>
        <LeadsFilterBar />
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No leads match this filter.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.businessName}</TableCell>
                  <TableCell>
                    <div>{lead.name}</div>
                    <div className="text-tiny text-muted-foreground">{lead.email}</div>
                    <div className="text-tiny text-muted-foreground">{lead.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="muted">{lead.industry}</Badge>
                  </TableCell>
                  <TableCell className="text-small">{lead.monthlyAdBudget.replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-small">{lead.currentChannels.join(", ")}</TableCell>
                  <TableCell className="text-small text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                  <TableCell>
                    <LeadStatusCell leadId={lead.id} status={lead.status as LeadStatus} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data.total > 0 && <PaginationBar page={data.page} totalPages={data.totalPages} />}
    </div>
  );
}
