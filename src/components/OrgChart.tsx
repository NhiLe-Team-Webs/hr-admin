import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Position,
  MarkerType,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface EmployeeData extends Record<string, unknown> {
  id: string;
  name: string;
  position: string;
  department: string;
  level: 'CEO' | 'Director' | 'Manager' | 'Staff';
  email: string;
  phone: string;
}

const employeeData: EmployeeData[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    position: 'CEO',
    department: 'Executive',
    level: 'CEO',
    email: 'ceo@company.com',
    phone: '0901234567'
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    position: 'Giám đốc Công nghệ',
    department: 'Technology',
    level: 'Director',
    email: 'cto@company.com',
    phone: '0901234568'
  },
  {
    id: '3',
    name: 'Lê Văn Cường',
    position: 'Giám đốc Nhân sự',
    department: 'HR',
    level: 'Director',
    email: 'hr@company.com',
    phone: '0901234569'
  },
  {
    id: '4',
    name: 'Phạm Thị Dung',
    position: 'Quản lý Frontend',
    department: 'Technology',
    level: 'Manager',
    email: 'frontend@company.com',
    phone: '0901234570'
  },
  {
    id: '5',
    name: 'Hoàng Văn Ê',
    position: 'Quản lý Backend',
    department: 'Technology',
    level: 'Manager',
    email: 'backend@company.com',
    phone: '0901234571'
  },
  {
    id: '6',
    name: 'Đỗ Thị Phương',
    position: 'Quản lý Tuyển dụng',
    department: 'HR',
    level: 'Manager',
    email: 'recruitment@company.com',
    phone: '0901234572'
  },
  {
    id: '7',
    name: 'Vũ Văn Giang',
    position: 'Frontend Developer',
    department: 'Technology',
    level: 'Staff',
    email: 'dev1@company.com',
    phone: '0901234573'
  },
  {
    id: '8',
    name: 'Bùi Thị Hoa',
    position: 'Backend Developer',
    department: 'Technology',
    level: 'Staff',
    email: 'dev2@company.com',
    phone: '0901234574'
  },
  {
    id: '9',
    name: 'Đinh Văn Inh',
    position: 'HR Specialist',
    department: 'HR',
    level: 'Staff',
    email: 'hr1@company.com',
    phone: '0901234575'
  }
];

const levelColors = {
  CEO: 'hsl(var(--destructive))',
  Director: 'hsl(var(--primary))',
  Manager: 'hsl(var(--status-blue))',
  Staff: 'hsl(var(--status-green))'
};

// Custom node component
const EmployeeNode = ({ data }: { data: EmployeeData }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  return (
    <Card className="p-4 min-w-[240px] shadow-elevated bg-card border-border">
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback
            className="text-white font-semibold"
            style={{ backgroundColor: levelColors[data.level] }}
          >
            {getInitials(data.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">{data.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{data.position}</p>
          <div className="flex items-center mt-1">
            <Badge
              variant="secondary"
              className="text-xs"
              style={{ backgroundColor: `${levelColors[data.level]}20`, color: levelColors[data.level] }}
            >
              {data.department}
            </Badge>
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground space-y-1">
        <div className="truncate">{data.email}</div>
        <div>{data.phone}</div>
      </div>
    </Card>
  );
};

const nodeTypes = {
  employee: EmployeeNode,
};

export default function OrgChart() {
  const initialNodes: Node[] = useMemo(() => [
    // CEO level
    {
      id: '1',
      type: 'employee',
      position: { x: 500, y: 0 },
      data: employeeData[0],
    },
    // Director level
    {
      id: '2',
      type: 'employee',
      position: { x: 200, y: 200 },
      data: employeeData[1],
    },
    {
      id: '3',
      type: 'employee',
      position: { x: 800, y: 200 },
      data: employeeData[2],
    },
    // Manager level
    {
      id: '4',
      type: 'employee',
      position: { x: 50, y: 400 },
      data: employeeData[3],
    },
    {
      id: '5',
      type: 'employee',
      position: { x: 350, y: 400 },
      data: employeeData[4],
    },
    {
      id: '6',
      type: 'employee',
      position: { x: 800, y: 400 },
      data: employeeData[5],
    },
    // Staff level
    {
      id: '7',
      type: 'employee',
      position: { x: 50, y: 600 },
      data: employeeData[6],
    },
    {
      id: '8',
      type: 'employee',
      position: { x: 350, y: 600 },
      data: employeeData[7],
    },
    {
      id: '9',
      type: 'employee',
      position: { x: 800, y: 600 },
      data: employeeData[8],
    },
  ], []);

  const initialEdges: Edge[] = useMemo(() => [
    // CEO to Directors
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'smoothstep',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
    },
    // Tech Director to Managers
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      type: 'smoothstep',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
    },
    {
      id: 'e2-5',
      source: '2',
      target: '5',
      type: 'smoothstep',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
    },
    // HR Director to Manager
    {
      id: 'e3-6',
      source: '3',
      target: '6',
      type: 'smoothstep',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
    },
    // Managers to Staff
    {
      id: 'e4-7',
      source: '4',
      target: '7',
      type: 'smoothstep',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
    },
    {
      id: 'e5-8',
      source: '5',
      target: '8',
      type: 'smoothstep',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
    },
    {
      id: 'e6-9',
      source: '6',
      target: '9',
      type: 'smoothstep',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
    },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: unknown) => {
      // Prevent adding new connections in org chart
      return;
    },
    []
  );

  return (
    <div className="h-[800px] w-full bg-background rounded-lg border border-border overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Strict}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        className="bg-background"
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          className="bg-card border-border"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <Background
          color="hsl(var(--muted-foreground))"
          gap={20}
          size={1}
          className="opacity-20"
        />
      </ReactFlow>
    </div>
  );
}