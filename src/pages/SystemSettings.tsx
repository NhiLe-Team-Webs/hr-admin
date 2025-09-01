import { useState, useRef, useEffect } from "react";
import { Brain, Briefcase, Dumbbell, Calendar, MessageCircle, Target, Settings, Users, Shield, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface WeightProfile {
  performance: number;
  influence: number;
  initiative: number;
  development: number;
  communication: number;
}

const profiles: Record<string, WeightProfile> = {
  default: { performance: 25, influence: 25, initiative: 20, development: 15, communication: 15 },
  tech: { performance: 30, influence: 15, initiative: 30, development: 15, communication: 10 },
  biz: { performance: 20, influence: 35, initiative: 15, development: 10, communication: 20 }
};

const integrations = [
  { name: "Công việc", icon: Briefcase, color: "blue", enabled: true },
  { name: "N-Fit", icon: Dumbbell, color: "green", enabled: true },
  { name: "N-Meeting", icon: Calendar, color: "purple", enabled: true },
  { name: "Telegram", icon: MessageCircle, color: "sky", enabled: false },
  { name: "EQ Test", icon: Brain, color: "pink", enabled: false },
];

export default function SystemSettings() {
  const [weights, setWeights] = useState<WeightProfile>(profiles.default);
  const [selectedProfile, setSelectedProfile] = useState("default");
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [aiSuggestionOpen, setAiSuggestionOpen] = useState(false);
  const [integrationStates, setIntegrationStates] = useState(
    integrations.reduce((acc, integration) => ({
      ...acc,
      [integration.name]: integration.enabled
    }), {})
  );

  const getTotalWeight = () => {
    return Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  };

  const updateWeight = (key: keyof WeightProfile, value: number) => {
    setWeights(prev => ({ ...prev, [key]: value }));
  };

  const applyProfile = (profileKey: string) => {
    setSelectedProfile(profileKey);
    setWeights(profiles[profileKey]);
  };

  const applyAISuggestion = () => {
    setWeights(prev => ({
      ...prev,
      initiative: Math.min(100, prev.initiative + 5)
    }));
    setAiSuggestionOpen(false);
  };

  const toggleIntegration = (name: string) => {
    setIntegrationStates(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const chartData = {
    labels: ['Nhóm Alpha', 'Nhóm Beta', 'Nhóm Gamma'],
    datasets: [
      {
        label: 'Điểm hiện tại',
        data: [9.1, 8.2, 7.8],
        backgroundColor: 'hsl(var(--muted))',
      },
      {
        label: 'Điểm mô phỏng',
        data: [9.3, 8.1, 7.9],
        backgroundColor: 'hsl(var(--primary))',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 10,
      },
    },
  };

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-card-foreground">Cấu hình Hệ thống</h1>
        <p className="text-muted-foreground mt-1">Quản lý tích hợp và thuật toán tính điểm tiềm năng.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Score Configuration */}
        <div className="lg:col-span-2 bg-card rounded-lg shadow-card p-6">
          <div className="border-b border-border pb-4 mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">Cấu hình Điểm Tiềm Năng Lãnh Đạo</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <label htmlFor="configProfile" className="text-sm font-medium">Chọn hình mẫu:</label>
                <Select value={selectedProfile} onValueChange={applyProfile}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Mặc định (Toàn công ty)</SelectItem>
                    <SelectItem value="tech">Leader Kỹ thuật</SelectItem>
                    <SelectItem value="biz">Leader Kinh doanh</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" className="text-sm text-primary hover:underline">Quản lý</Button>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Tổng trọng số</p>
                <p className={`text-2xl font-bold ${getTotalWeight() === 100 ? 'text-status-green' : 'text-destructive'}`}>
                  {getTotalWeight()}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Weight Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-sm font-medium text-card-foreground mb-2">
                  <span className="flex items-center">
                    <Target className="mr-2 h-4 w-4 text-muted-foreground" />
                    Hiệu suất (Trello, Meeting)
                  </span>
                  <span className="font-bold text-primary">{weights.performance}%</span>
                </div>
                <Slider
                  value={[weights.performance]}
                  onValueChange={([value]) => updateWeight('performance', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-medium text-card-foreground mb-2">
                  <span className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    Ảnh hưởng (Kudos, 360°)
                  </span>
                  <span className="font-bold text-primary">{weights.influence}%</span>
                </div>
                <Slider
                  value={[weights.influence]}
                  onValueChange={([value]) => updateWeight('influence', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-medium text-card-foreground mb-2">
                  <span className="flex items-center">
                    <Brain className="mr-2 h-4 w-4 text-muted-foreground" />
                    Sáng kiến & Giải quyết vấn đề
                  </span>
                  <span className="font-bold text-primary">{weights.initiative}%</span>
                </div>
                <Slider
                  value={[weights.initiative]}
                  onValueChange={([value]) => updateWeight('initiative', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-medium text-card-foreground mb-2">
                  <span className="flex items-center">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    Phát triển cá nhân (N-Fit, Learning)
                  </span>
                  <span className="font-bold text-primary">{weights.development}%</span>
                </div>
                <Slider
                  value={[weights.development]}
                  onValueChange={([value]) => updateWeight('development', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-medium text-card-foreground mb-2">
                  <span className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    Giao tiếp (Chat)
                  </span>
                  <span className="font-bold text-primary">{weights.communication}%</span>
                </div>
                <Slider
                  value={[weights.communication]}
                  onValueChange={([value]) => updateWeight('communication', value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-4 flex justify-between items-center">
            <div>
              <Button 
                variant="outline" 
                onClick={() => setAiSuggestionOpen(true)}
                className="bg-status-yellow/10 text-status-yellow border-status-yellow/20 hover:bg-status-yellow/20"
              >
                <Brain className="mr-2 h-4 w-4" />
                AI Gợi ý
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setSimulationOpen(true)}>
                Xem trước thay đổi
              </Button>
              <Button>Lưu cấu hình</Button>
            </div>
          </div>
        </div>

        {/* Right Column: Integrations */}
        <div className="lg:col-span-1 bg-card rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold mb-4 border-b border-border pb-4 text-card-foreground">Quản lý Tích hợp</h3>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div key={integration.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-md mr-3 bg-${integration.color}-100 flex items-center justify-center`}>
                      <Icon className={`text-${integration.color}-600 h-4 w-4`} />
                    </div>
                    <span className="font-medium text-card-foreground">{integration.name}</span>
                  </div>
                  <Switch
                    checked={integrationStates[integration.name]}
                    onCheckedChange={() => toggleIntegration(integration.name)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulation Modal */}
      <Dialog open={simulationOpen} onOpenChange={setSimulationOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Mô phỏng Tác động</DialogTitle>
            <DialogDescription>
              Biểu đồ này mô phỏng điểm trung bình của các nhóm sẽ thay đổi như thế nào nếu áp dụng cấu hình mới.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Suggestion Modal */}
      <Dialog open={aiSuggestionOpen} onOpenChange={setAiSuggestionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-status-yellow/10 mb-4">
              <Brain className="text-2xl text-status-yellow h-6 w-6" />
            </div>
            <DialogTitle>Gợi ý từ AI</DialogTitle>
            <DialogDescription className="text-center">
              Dữ liệu cho thấy các Leader hàng đầu của bạn có chỉ số <strong>Sáng kiến</strong> rất cao. 
              Bạn có muốn tăng trọng số cho chỉ số này để phản ánh đúng hơn phẩm chất của một Leader thành công không?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-3 mt-6">
            <Button onClick={applyAISuggestion}>
              Áp dụng gợi ý
            </Button>
            <Button variant="outline" onClick={() => setAiSuggestionOpen(false)}>
              Bỏ qua
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}