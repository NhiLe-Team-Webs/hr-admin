import { useState } from "react";
import { Plus, UserPlus, UserMinus, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrgChart from "@/components/OrgChart";

interface ProcessCard {
  id: string;
  name: string;
  position: string;
  startDate: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
}

const onboardingData: ProcessCard[] = [
  {
    id: '1',
    name: 'Lê Thị Mai',
    position: 'Backend Developer',
    startDate: '25/08/2025',
    progress: 0,
    status: 'pending'
  },
  {
    id: '2', 
    name: 'Trần Văn Hùng',
    position: 'Frontend Developer',
    startDate: '18/08/2025',
    progress: 75,
    status: 'in-progress'
  },
  {
    id: '3',
    name: 'Nguyễn Thị An',
    position: 'UI/UX Designer', 
    startDate: '18/08/2025',
    progress: 40,
    status: 'in-progress'
  },
  {
    id: '4',
    name: 'Phạm Văn Bình',
    position: 'Project Manager',
    startDate: '01/08/2025',
    progress: 100,
    status: 'completed'
  }
];

const statusConfig = {
  pending: {
    label: 'Sắp bắt đầu',
    color: 'bg-status-blue',
    bgColor: 'bg-blue-50',
    progressColor: 'bg-status-blue'
  },
  'in-progress': {
    label: 'Đang tiến hành',
    color: 'bg-status-yellow', 
    bgColor: 'bg-yellow-50',
    progressColor: 'bg-status-yellow'
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-status-green',
    bgColor: 'bg-green-50', 
    progressColor: 'bg-status-green'
  }
};

interface KanbanColumnProps {
  status: 'pending' | 'in-progress' | 'completed';
  cards: ProcessCard[];
}

function KanbanColumn({ status, cards }: KanbanColumnProps) {
  const config = statusConfig[status];
  const filteredCards = cards.filter(card => card.status === status);
  
  return (
    <div className="w-80 bg-secondary rounded-lg p-4 flex flex-col">
      <h3 className="font-semibold text-card-foreground mb-4 flex items-center">
        <div className={`w-2 h-2 rounded-full ${config.color} mr-2`}></div>
        {config.label} ({filteredCards.length})
      </h3>
      
      <div className="space-y-3 overflow-y-auto flex-1">
        {filteredCards.map(card => (
          <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="font-semibold text-card-foreground">{card.name}</p>
              <p className="text-sm text-muted-foreground">{card.position}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Ngày bắt đầu: {card.startDate}
              </p>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
                  <span>Tiến độ</span>
                  <span>{card.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`${config.progressColor} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${card.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function OrganizationManagement() {
  const [activeTab, setActiveTab] = useState("organization");
  
  return (
    <div className="p-8 flex flex-col h-full">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">Quản lý Tổ chức</h1>
          <p className="text-muted-foreground mt-1">Sơ đồ tổ chức và quy trình nhân sự.</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhân viên
        </Button>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-fit grid-cols-3 mb-6">
          <TabsTrigger value="organization" className="flex items-center">
            <Network className="mr-2 h-4 w-4" />
            Sơ đồ Tổ chức
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            On-boarding
          </TabsTrigger>
          <TabsTrigger value="outboarding" className="flex items-center">
            <UserMinus className="mr-2 h-4 w-4" />
            Out-boarding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="flex-1 overflow-hidden">
          <div className="h-full">
            <OrgChart />
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="flex-1 overflow-hidden">
          <div className="h-full overflow-x-auto">
            <div className="inline-flex space-x-4 h-full pb-4">
              <KanbanColumn status="pending" cards={onboardingData} />
              <KanbanColumn status="in-progress" cards={onboardingData} />
              <KanbanColumn status="completed" cards={onboardingData} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="outboarding" className="flex-1 overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <UserMinus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Chưa có quy trình Out-boarding</h3>
              <p className="text-muted-foreground">Tạo quy trình mới để bắt đầu theo dõi.</p>
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Tạo quy trình Out-boarding
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}