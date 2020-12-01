import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { RiskModule } from '@risk/RiskModule'
import { agent } from 'supertest'

describe('Integration :: Risk :: Presenter :: RiskController', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RiskModule]
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  describe(`/POST risk/profile`, () => {
    describe('when house is rented', () => {
      it(`returns the risk profile without the home line`, async () => {
        const request = {
          age: 35,
          dependents: 2,
          house: { ownership_status: 'rented' },
          income: 0,
          marital_status: 'married',
          risk_questions: [0, 1, 0],
          vehicle: { year: 2018 }
        }

        const expectedResult = {
          statusCode: 200,
          errors: [],
          data: {
            auto: 'regular',
            disability: 'ineligible',
            renters: 'economic',
            life: 'regular',
            umbrella: 'economic'
          }
        }

        const { body } = await agent(app.getHttpServer())
          .post('/risk/profile')
          .send(request)
          .expect(200)
          .expect(expectedResult)
        expect(body.data.home).toBeUndefined()
      })
    })

    describe('when house is not rented', () => {
      it(`returns the risk profile without the renters line`, async () => {
        const request = {
          age: 35,
          dependents: 2,
          house: { ownership_status: 'owned' },
          income: 0,
          marital_status: 'married',
          risk_questions: [0, 1, 0],
          vehicle: { year: 2018 }
        }

        const expectedResult = {
          statusCode: 200,
          errors: [],
          data: {
            auto: 'regular',
            disability: 'ineligible',
            home: 'economic',
            life: 'regular',
            umbrella: 'economic'
          }
        }

        const { body } = await agent(app.getHttpServer())
          .post('/risk/profile')
          .send(request)
          .expect(200)
          .expect(expectedResult)
        expect(body.data.renters).toBeUndefined()
      })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
