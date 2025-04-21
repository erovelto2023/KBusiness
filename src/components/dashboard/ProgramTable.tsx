
import { Program } from "../../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface ProgramTableProps {
  programs: Program[];
}

export const ProgramTable = ({ programs }: ProgramTableProps) => {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead className="text-right">Sales</TableHead>
            <TableHead className="text-right">Earned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{program.name}</TableCell>
              <TableCell>{program.category}</TableCell>
              <TableCell>{program.platform}</TableCell>
              <TableCell className="text-right">{program.sales}</TableCell>
              <TableCell className="text-right">${program.earned?.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
