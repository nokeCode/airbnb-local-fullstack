# TODO: Full Frontend Contracts Integration with Backend

## Current Status
- [x] Analyzed backend APIs/models/workflow
- [x] Reviewed frontend files (services, pages, types)
- [x] Plan approved by user

## Implementation Steps (Execute sequentially)

### 1. Extend Types (app/types/)
- [x] Create/update Contract type with payments, expenses, agent_details
- Path: `app/types/contract.ts` (new)

### 2. Enhance Services
- [ ] services/contractsService.ts: Add createContract, getContractDetail, terminateContract, createPayment
- [ ] services/propertiesService.ts: Add getAvailableProperties (status=available)
- [ ] services/usersService.ts: Add getClients (role=client)

### 3. Contracts List Page
- [ ] app/dashboard/contrats/page.tsx: Add detail link (/contrats/[id]), terminate button (modal), payments preview

### 4. Create Contract Form
- [ ] app/dashboard/contrats/ajouter/page.tsx: Fetch real properties/clients, POST createContract, handle upload/redirect

### 5. Contract Detail Page (NEW)
- [ ] app/dashboard/contrats/[id]/page.tsx: Tabs (info/payments/expenses), terminate, add payment form

### 6. Integrate Stats/Finances
- [ ] app/dashboard/statistiques/page.tsx: Use getContractsDashboard
- [ ] app/dashboard/finances/page.tsx: Full payments/expenses data

### 7. Testing
- [ ] Run `npm run dev`
- [ ] Test create/view/payments/terminate flows
- [ ] Verify role permissions

## Next Step: Start with types → services → pages
