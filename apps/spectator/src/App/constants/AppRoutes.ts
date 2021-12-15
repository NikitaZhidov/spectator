export class AppRoutes {
	static readonly Plan = '/plan';
	static readonly PlanCreate = '/plan/create';
	static readonly PlanEdit = '/plan/edit/:id';
	static readonly PlanWithId = '/plan/:id';

	static RouteToPlanEdit(id: string) {
		return AppRoutes.PlanEdit.replace(':id', id);
	}

	static RouteToWatchPlan(id: string) {
		return AppRoutes.PlanWithId.replace(':id', id);
	}

	static isMainAppRoute(route: string) {
		return route === this.Plan || route === this.PlanCreate;
	}
}
