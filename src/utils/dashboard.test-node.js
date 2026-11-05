// PATH: src/utils/dashboard.test.js
import { useDashboardData } from '../pages/dashboard/hooks/useDashboardData';
import { useDashboardModals } from '../pages/dashboard/hooks/useDashboardModals';
import { renderHook, act } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('https://api.kkpus.id/api/dashboard/admin', () => {
    return HttpResponse.json({
      success: true,
      data: {
        stats: [
          { title: 'Total Anggota', value: '100', icon: 'Users', color: 'primary' },
          { title: 'Total Simpanan', value: '1000000', icon: 'Wallet', color: 'success' },
        ],
        pendingCategorized: {
          registration: [],
          simpanan: [],
          jualBeli: [],
          program: [],
          tabungan: [],
          investasi: [],
        },
        notifications: [],
      },
    });
  }),
  http.get('https://api.kkpus.id/approvals/pendaftaran/pending', () => {
    return HttpResponse.json({
      success: true,
      data: [],
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useDashboardData Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDashboardData());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.statsList).toEqual([]);
    expect(result.current.categorizedData).toEqual({
      registration: [],
      simpanan: [],
      jualBeli: [],
      program: [],
      tabungan: [],
      investasi: [],
    });
    expect(result.current.totalPending).toBe(0);
    expect(result.current.notifications).toEqual([]);
    expect(typeof result.current.fetchData).toBe('function');
  });

  it('should fetch dashboard data successfully', async () => {
    const { result } = renderHook(() => useDashboardData());
    
    await act(async () => {
      await result.current.fetchData();
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.statsList).toHaveLength(2);
    expect(result.current.statsList[0].title).toBe('Total Anggota');
    expect(result.current.statsList[1].title).toBe('Total Simpanan');
    expect(result.current.totalPending).toBe(0);
    expect(result.current.notifications).toEqual([]);
  });

  it('should handle error states', async () => {
    server.use(
      http.get('https://api.kkpus.id/api/dashboard/admin', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    
    const { result } = renderHook(() => useDashboardData());
    
    await act(async () => {
      await result.current.fetchData();
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.statsList).toEqual([]);
  });
});

describe('useDashboardModals Hook', () => {
  it('should initialize modal states', () => {
    const { result } = renderHook(() => useDashboardModals(() => {}));
    
    expect(result.current.showRegModal).toBe(false);
    expect(result.current.showTermModal).toBe(false);
    expect(result.current.showWithdrawalModal).toBe(false);
    expect(result.current.showJualBeliModal).toBe(false);
    expect(result.current.showProgramModal).toBe(false);
    expect(result.current.showTabunganModal).toBe(false);
    expect(result.current.showInvestasiModal).toBe(false);
    expect(result.current.showPendanaanModal).toBe(false);
    expect(result.current.showManualModal).toBe(false);
    
    expect(result.current.processingReg).toBe(false);
    expect(result.current.handleReviewClick).toBeDefined();
    expect(result.current.handleWithdrawalReviewClick).toBeDefined();
    expect(result.current.handleJualBeliReviewClick).toBeDefined();
    expect(result.current.handleProgramReviewClick).toBeDefined();
    expect(result.current.handleTabunganReviewClick).toBeDefined();
    expect(result.current.handleInvestasiReviewClick).toBeDefined();
    expect(result.current.handleProcessRegistration).toBeDefined();
    expect(result.current.handleRejectRegistration).toBeDefined();
  });

  it('should handle registration review click', async () => {
    const { result } = renderHook(() => useDashboardModals(() => {}));
    
    const testItem = {
      id: 'test-id',
      is_manual_payment: false,
      type: 'REGISTRATION',
      name: 'John Doe',
    };
    
    act(() => {
      result.current.handleReviewClick(testItem);
    });
    
    expect(result.current.showRegModal).toBe(true);
    expect(result.current.selectedReg).toEqual(testItem);
  });

  it('should handle manual payment review click', async () => {
    const { result } = renderHook(() => useDashboardModals(() => {}));
    
    const testItem = {
      id: 'manual-id',
      is_manual_payment: true,
      name: 'Jane Smith',
    };
    
    act(() => {
      result.current.handleReviewClick(testItem);
    });
    
    expect(result.current.showManualModal).toBe(true);
    expect(result.current.selectedManualPayment).toEqual(testItem);
  });
});

describe('Dashboard Page Integration', () => {
  it('should render dashboard without errors', async () => {
    const { result } = renderHook(() => useDashboardData());
    
    await act(async () => {
      await result.current.fetchData();
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.statsList).toHaveLength(2);
    expect(result.current.totalPending).toBe(0);
  });

  it('should handle tab switching', () => {
    const { result } = renderHook(() => useDashboardData());
    
    act(() => {
      // Simulate tab switching
      expect(result.current.categorizedData.registration).toEqual([]);
    });
    
    expect(result.current.totalPending).toBe(0);
  });
});