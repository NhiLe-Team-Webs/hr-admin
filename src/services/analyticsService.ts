import api from "@/lib/api";

export interface TeamMemberRatio {
    team: string;
    count: number;
    fill?: string;
}

export interface RoleRatio {
    role: string;
    count: number;
    fill?: string;
}

export interface AgeRatio {
    range: string;
    count: number;
}

export interface JoinTrend {
    week: string;
    count: number;
}

export interface TeamChangeTrend {
    week: string;
    [key: string]: string | number;
}

export interface AnalyticsOverview {
    totalMembers: number;
    teamMemberRatio: TeamMemberRatio[];
    roleRatio: RoleRatio[];
    ageRatio: AgeRatio[];
    joinTrend: JoinTrend[];
    teamChangeTrend: TeamChangeTrend[];
}

interface BackendTeamMember {
    team: string;
    count: number;
}

interface BackendRole {
    role: string;
    count: number;
}

interface BackendAgeDistribution {
    bucket: string;
    count: number;
}

interface BackendJoinTrend {
    week: string;
    count: number;
}

interface BackendTeamChange {
    week: string;
    team: string;
    count: number;
}

interface BackendOverviewResponse {
    totalMembers: number;
    teamMemberRatio: BackendTeamMember[];
    roleRatio: BackendRole[];
    ageDistribution: BackendAgeDistribution[];
    joinTrend: BackendJoinTrend[];
    teamChangeTrend: BackendTeamChange[];
}

const mockData: AnalyticsOverview = {
    totalMembers: 0,
    teamMemberRatio: [],
    roleRatio: [],
    ageRatio: [],
    joinTrend: [],
    teamChangeTrend: []
};

const CHART_COLORS = [
    "#3B82F6", // Primary Blue
    "#60A5FA", // Light Blue
    "#2563EB", // Deep Blue
    "#93C5FD", // Lighter Blue
    "#1D4ED8", // Darker Blue
];

export const analyticsService = {
    getOverview: async (): Promise<AnalyticsOverview> => {
        try {
            const response = await api.get("/hr/analytics/team-overview");
            if (response.data.success) {
                const raw = response.data.data as BackendOverviewResponse;

                // Transform data to match frontend requirements and add colors
                const teamMemberRatio = (raw.teamMemberRatio || []).map((item, index) => ({
                    team: item.team,
                    count: item.count,
                    fill: CHART_COLORS[index % CHART_COLORS.length]
                }));

                const roleMap: Record<string, number> = {};
                (raw.roleRatio || []).forEach(item => {
                    let role = item.role;
                    const lowRole = role.toLowerCase();
                    if (lowRole === 'coleader' || lowRole === 'admin' || lowRole === 'ad') {
                        role = 'Colead';
                    }
                    roleMap[role] = (roleMap[role] || 0) + item.count;
                });

                const roleRatio = Object.entries(roleMap).map(([role, count], index) => ({
                    role,
                    count,
                    fill: CHART_COLORS[index % CHART_COLORS.length]
                }));

                const ageRatio = (raw.ageDistribution || []).map((item) => ({
                    range: item.bucket,
                    count: item.count
                }));

                const joinTrend = (raw.joinTrend || []).map((item) => ({
                    week: item.week,
                    count: item.count
                }));

                // Transform flat teamChangeTrend [ {week, team, count} ] to grouped [ {week, Marketing, Design...} ]
                const teamChangeGrouped: Record<string, TeamChangeTrend> = {};
                (raw.teamChangeTrend || []).forEach((item) => {
                    if (!teamChangeGrouped[item.week]) {
                        teamChangeGrouped[item.week] = { week: item.week };
                    }
                    teamChangeGrouped[item.week][item.team] = item.count;
                });

                return {
                    totalMembers: raw.totalMembers,
                    teamMemberRatio,
                    roleRatio,
                    ageRatio,
                    joinTrend,
                    teamChangeTrend: Object.values(teamChangeGrouped)
                };
            }
            return mockData;
        } catch (error) {
            console.error("Error fetching from server:", error);
            return mockData;
        }
    }
};
