import { Users, UsersRound, Star, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface Employee {
  id?: string;
  name: string;
  position: string;
  avatar: string;
  nickname: string;
  telegram: string;
  phone: string;
}

const statsCards = [
  {
    title: "Tổng nhân sự",
    value: "50",
    icon: Users,
    color: "text-status-blue",
    bgColor: "bg-blue-50"
  },
  {
    title: "Tổng đội nhóm", 
    value: "5",
    icon: UsersRound,
    color: "text-status-yellow",
    bgColor: "bg-yellow-50"
  },
  {
    title: "Điểm T.Năng Lãnh Đạo",
    value: "8.5",
    suffix: "/10",
    icon: Star,
    color: "text-status-green", 
    bgColor: "bg-green-50"
  },
  {
    title: "Phê duyệt đang chờ",
    value: "3",
    icon: Clock,
    color: "text-status-orange",
    bgColor: "bg-orange-50"
  }
];

const organizationData = {
  ceo: { 
    name: 'Nguyễn Văn An', 
    position: 'CEO', 
    nickname: 'AnNV', 
    telegram: '@annv_ceo', 
    phone: '0901234567',
    avatar: 'A'
  },
  manager1: { 
    name: 'Trần Thị Bích', 
    position: 'Manager Leader', 
    nickname: 'BichTT', 
    telegram: '@bich_manager', 
    phone: '0902345678',
    avatar: 'B'
  },
  leader1: { 
    name: 'Lê Minh Cường', 
    position: 'Leader', 
    nickname: 'CuongLM', 
    telegram: '@cuong_leader', 
    phone: '0903456789',
    avatar: 'C'
  },
  member1: { 
    name: 'Phạm Thị Dung', 
    position: 'Thành viên', 
    nickname: 'DungPT', 
    telegram: '@dung_member', 
    phone: '0904567890',
    avatar: 'D'
  },
  newbie1: { 
    name: 'Hoàng Văn Em', 
    position: 'Tình nguyện viên', 
    nickname: 'EmHV', 
    telegram: '@em_newbie', 
    phone: '0905678901',
    avatar: 'E'
  },
  leader2: { 
    name: 'Nguyễn Thị Hằng', 
    position: 'Leader', 
    nickname: 'HangNT', 
    telegram: '@hang_leader', 
    phone: '0906789012',
    avatar: 'H'
  },
  member2: { 
    name: 'Vũ Thị Lan', 
    position: 'Thành viên', 
    nickname: 'LanVT', 
    telegram: '@lan_member', 
    phone: '0907890123',
    avatar: 'L'
  }
};

interface OrgNodeProps {
  employee: Employee;
  onClick: () => void;
}

function OrgNode({ employee, onClick }: OrgNodeProps) {
  return (
    <div 
      className="inline-flex items-center min-w-48 p-3 bg-card border-2 border-border rounded-lg cursor-pointer transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary"
      onClick={onClick}
    >
      <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center mr-3">
        {employee.avatar}
      </div>
      <div className="text-left">
        <div className="font-semibold text-sm">{employee.name}</div>
        <div className="text-xs text-muted-foreground">{employee.position}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleEmployeeClick = (employeeKey: string) => {
    setSelectedEmployee(organizationData[employeeKey as keyof typeof organizationData]);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-card-foreground">HR Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Tổng quan toàn bộ hệ thống tổ chức.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.bgColor} ${stat.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {stat.value}
                      {stat.suffix && <span className="text-base text-muted-foreground">{stat.suffix}</span>}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Organization Chart */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-card-foreground">Sơ đồ Tổ chức</h3>
          <div className="w-full overflow-x-auto">
            <div className="tree min-w-max py-4">
              <ul className="flex flex-col items-center">
                <li className="mb-8">
                  <OrgNode 
                    employee={organizationData.ceo} 
                    onClick={() => handleEmployeeClick('ceo')} 
                  />
                  <div className="flex justify-center mt-4">
                    <div className="w-px h-8 bg-border"></div>
                  </div>
                  <ul className="flex justify-center">
                    <li className="mx-4">
                      <OrgNode 
                        employee={organizationData.manager1} 
                        onClick={() => handleEmployeeClick('manager1')} 
                      />
                      <div className="flex justify-center mt-4">
                        <div className="w-px h-8 bg-border"></div>
                      </div>
                      <ul className="flex gap-8 justify-center">
                        <li>
                          <OrgNode 
                            employee={organizationData.leader1} 
                            onClick={() => handleEmployeeClick('leader1')} 
                          />
                          <div className="flex justify-center mt-4">
                            <div className="w-px h-8 bg-border"></div>
                          </div>
                          <ul className="flex gap-6 justify-center">
                            <li>
                              <OrgNode 
                                employee={organizationData.member1} 
                                onClick={() => handleEmployeeClick('member1')} 
                              />
                            </li>
                            <li>
                              <OrgNode 
                                employee={organizationData.newbie1} 
                                onClick={() => handleEmployeeClick('newbie1')} 
                              />
                            </li>
                          </ul>
                        </li>
                        <li>
                          <OrgNode 
                            employee={organizationData.leader2} 
                            onClick={() => handleEmployeeClick('leader2')} 
                          />
                          <div className="flex justify-center mt-4">
                            <div className="w-px h-8 bg-border"></div>
                          </div>
                          <ul className="flex justify-center">
                            <li>
                              <OrgNode 
                                employee={organizationData.member2} 
                                onClick={() => handleEmployeeClick('member2')} 
                              />
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Details Modal */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xl">
                {selectedEmployee?.avatar}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">{selectedEmployee?.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">{selectedEmployee?.position}</p>
              </div>
            </div>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Telegram:</span>
                <span className="text-sm text-muted-foreground">{selectedEmployee.telegram}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nickname:</span>
                <span className="text-sm text-muted-foreground">{selectedEmployee.nickname}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Số điện thoại:</span>
                <span className="text-sm text-muted-foreground">{selectedEmployee.phone}</span>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-border">
                <Button 
                  variant="secondary"
                  onClick={() => setSelectedEmployee(null)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}