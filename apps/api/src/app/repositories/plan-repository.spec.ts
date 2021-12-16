import 'reflect-metadata';
import { FigureType, PlanData } from '@spectator/api-interfaces';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IPlanRepository } from '../interfaces';
import container from '../ioc/inversify.test.config';
import { TYPES } from '../ioc/types';

describe('PlanRepository:', () => {
	let planRepository: IPlanRepository;
	const mockPlan: PlanData = {
		title: 'mock plan',
		id: uuidv4(),
		figures: [
			{
				title: 'Figure1',
				type: FigureType.rectangle,
				begin: { x: 10, y: 10 },
				end: { x: 40, y: 40 },
				id: Date.now(),
			},
		],
	};

	const mockPlanForUpdate: PlanData = {
		title: 'mock plan 2',
		id: uuidv4(),
		figures: [
			{
				title: 'Figure 2',
				type: FigureType.rectangle,
				begin: { x: 10, y: 10 },
				end: { x: 40, y: 40 },
				id: Date.now(),
			},
			{
				title: 'Figure 2',
				type: FigureType.rectangle,
				begin: { x: 10, y: 10 },
				end: { x: 40, y: 40 },
				id: Date.now(),
			},
		],
	};

	let planInDb: PlanData;

	const mockInvalidData: any = {
		string: 'value',
	};

	beforeAll(async () => {
		const mongoServer = await MongoMemoryServer.create();
		await mongoose.connect(mongoServer.getUri());

		planRepository = container.get(TYPES.IPlanRepository);

		planInDb = await planRepository.Create(mockPlan);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	});

	describe('Plan get:', () => {
		it('should return correct plan by id', async () => {
			const planToCheck = await planRepository.GetById(planInDb.id);

			expect(planToCheck.title).toBe(planInDb.title);
			expect(planToCheck.id).toBe(planInDb.id);
			expect(planToCheck.figures.length).toBe(planInDb.figures.length);
		});

		it('should return null when id is invalid', async () => {
			const planToCheck = await planRepository.GetById(`${planInDb.id}invalid`);

			expect(planToCheck).toBe(null);
		});

		it('should return all plans', async () => {
			const plan = await planRepository.Create(mockPlan);
			const plan2 = await planRepository.Create(mockPlanForUpdate);

			const allPlans = await planRepository.GetAll();

			// 1 существующий (при инициализации beforeAll) + 2
			expect(allPlans.length).toBe(3);
			expect(allPlans[1].id).toBe(plan.id);
			expect(allPlans[2].id).toBe(plan2.id);

			await planRepository.DeletePlan(plan.id);
			await planRepository.DeletePlan(plan2.id);
		});

		it('should return empty array if no plans', async () => {
			await planRepository.DeletePlan(planInDb.id);

			const allPlans = await planRepository.GetAll();
			expect(allPlans.length).toBe(0);

			planInDb = await planRepository.Create(mockPlan);
		});
	});

	describe('Plan delete:', () => {
		it('should delete plan from database', async () => {
			const plan = await planRepository.GetById(planInDb.id);
			await planRepository.DeletePlan(planInDb.id);
			const planToCheck = await planRepository.GetById(plan.id);

			expect(planToCheck).toBe(null);

			await planRepository.Create(mockPlan);
		});
	});

	describe('Plan create:', () => {
		it('should return saved plan', async () => {
			const plan = await planRepository.Create(mockPlan);

			expect(mockPlan.title).toBe(plan.title);
			expect(mockPlan.figures.length).toBe(plan.figures.length);

			await planRepository.DeletePlan(plan.id);
		});

		it('plan must be saved to the database', async () => {
			const plan = await planRepository.Create(mockPlan);

			const resPlan = await planRepository.GetById(plan.id);

			expect(plan.title).toBe(resPlan.title);
			expect(plan.figures.length).toBe(resPlan.figures.length);

			await planRepository.DeletePlan(plan.id);
		});

		it('must be throw exception when input is invalid', async () => {
			try {
				await planRepository.Create(mockInvalidData);
				expect(true).toBe(false);
			} catch (error) {
				expect(true).toBeTruthy();
			}
		});
	});

	describe('Plane update:', () => {
		it('should return updated plan', async () => {
			const savedPlan = await planRepository.Create(mockPlan);
			const updatedPlan = await planRepository.Update(
				mockPlanForUpdate,
				savedPlan.id
			);

			expect(updatedPlan.title).toBe(mockPlanForUpdate.title);
			expect(updatedPlan.figures.length).toBe(mockPlanForUpdate.figures.length);
		});

		it('plan must be updated in the database', async () => {
			const savedPlan = await planRepository.Create(mockPlan);
			const updatedPlan = await planRepository.Update(
				mockPlanForUpdate,
				savedPlan.id
			);

			const planToCheck = await planRepository.GetById(updatedPlan.id);

			expect(planToCheck.title).toBe(updatedPlan.title);
			expect(planToCheck.figures.length).toBe(updatedPlan.figures.length);
			expect(planToCheck.figures[0].title).toBe(updatedPlan.figures[0].title);
		});

		it('must be throw exception when input is invalid', async () => {
			try {
				await planRepository.Update(mockInvalidData, 'invalid id');
				expect(true).toBe(false);
			} catch (error) {
				expect(true).toBeTruthy();
			}
		});
	});
});
