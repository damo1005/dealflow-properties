import { create } from 'zustand';
import { MileageLog, ExpenseReceipt, HMRC_MILEAGE_RATE } from '@/types/mileage';

interface MileageState {
  logs: MileageLog[];
  receipts: ExpenseReceipt[];
  isLoading: boolean;

  addLog: (log: Omit<MileageLog, 'id' | 'user_id' | 'created_at' | 'rate_per_mile'>) => void;
  deleteLog: (id: string) => void;
  getTotalMiles: () => number;
  getTotalClaimable: () => number;
  getLogsByProperty: (propertyId: string) => MileageLog[];
  getTaxYearSummary: () => { totalMiles: number; totalClaimable: number; journeyCount: number };
}

const mockLogs: MileageLog[] = [
  { id: '1', user_id: 'current-user', portfolio_property_id: 'prop-1', journey_date: new Date().toISOString().split('T')[0], from_location: 'Home', to_location: '14 Oak Street', purpose: 'tenant_meeting', miles: 8.5, rate_per_mile: 0.45, vehicle: 'Car', notes: null, created_at: new Date().toISOString() },
  { id: '2', user_id: 'current-user', portfolio_property_id: 'prop-2', journey_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], from_location: 'Home', to_location: '28 Victoria Road', purpose: 'inspection', miles: 12.3, rate_per_mile: 0.45, vehicle: 'Car', notes: 'Quarterly inspection', created_at: new Date().toISOString() },
  { id: '3', user_id: 'current-user', portfolio_property_id: 'prop-1', journey_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], from_location: 'Home', to_location: '14 Oak Street', purpose: 'maintenance', miles: 8.5, rate_per_mile: 0.45, vehicle: 'Car', notes: 'Boiler repair', created_at: new Date().toISOString() },
  { id: '4', user_id: 'current-user', portfolio_property_id: null, journey_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], from_location: 'Home', to_location: '45 High Street (viewing)', purpose: 'viewing', miles: 15.2, rate_per_mile: 0.45, vehicle: 'Car', notes: 'Potential BTL', created_at: new Date().toISOString() },
];

export const useMileageStore = create<MileageState>((set, get) => ({
  logs: mockLogs,
  receipts: [],
  isLoading: false,

  addLog: (logData) => {
    const newLog: MileageLog = {
      ...logData,
      id: crypto.randomUUID(),
      user_id: 'current-user',
      rate_per_mile: HMRC_MILEAGE_RATE,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ logs: [newLog, ...state.logs] }));
  },

  deleteLog: (id) => {
    set((state) => ({ logs: state.logs.filter(l => l.id !== id) }));
  },

  getTotalMiles: () => get().logs.reduce((sum, log) => sum + log.miles, 0),

  getTotalClaimable: () => get().logs.reduce((sum, log) => sum + (log.miles * log.rate_per_mile), 0),

  getLogsByProperty: (propertyId) => get().logs.filter(l => l.portfolio_property_id === propertyId),

  getTaxYearSummary: () => {
    const logs = get().logs;
    const totalMiles = logs.reduce((sum, log) => sum + log.miles, 0);
    const totalClaimable = logs.reduce((sum, log) => sum + (log.miles * log.rate_per_mile), 0);
    return { totalMiles, totalClaimable, journeyCount: logs.length };
  },
}));
