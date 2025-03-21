# API HouseCare
API feita como trabalho final da disciplina de Desenvolvimento de sofware em nuvem.

## Funcionalidades:
- Criação de usuários ([POST] /users)
- Listagem de todos os usuários ([GET] /users)
- Listar usuário logado ([GET] /users/logged)
- Listar um usuário específico ([GET] /users/:id)
- Atualização de usuários ([PUT] /users)
- Remoção de usuários ([DELETE] /users/:id)

  </br>

- Criação de clínica ([POST] /clinics)
- Listagem de todas as clínicaa ([GET] /clinics)
- Listar uma clínica específica ([GET] /clinics/:id)
- Atualização de clínica ([PUT] /clinics/:id)
- Remoção de clínica ([DELETE] /clinics/:id)

    </br>

- Criação de exame ([POST] /exam)
- Listagem de todos os exames ([GET] /exam)
- Listar um exame específico ([GET] /exam/:id)
- Atualização de exame ([PUT] /exam/:id)
- Remoção de exame ([DELETE] /exam/:id)
  
    </br>

- Criação de médico ([POST] /medic)
- Listagem de todos os médico ([GET] /medic)
- Listar um médico específico ([GET] /medic/:id)
- Atualização de médico ([PUT] /medic/:id)
- Remoção de médico ([DELETE] /medic/:id)
    
    </br>

- Criação de agendamento ([POST] /schedules)
- Listagem de todos os agendamentos ([GET] /schedules)
- Listar agendamentos do usuário logado ([GET] /schedules/)
- Listar um agendamento específico ([GET] /schedules/:id)
- Atualização de agendamento ([PUT] /schedules/:id)
- Remoção de agendamento ([DELETE] /schedules/:id)
      
    </br>

- Criação de especialidade ([POST] /specialtys)
- Listagem de todas as especialidade ([GET] /specialtys)
- Listar uma especialidade específica ([GET] /specialtys/:id)
- Atualização de especialidade ([PUT] /specialtys/:id)
- Remoção de especialidade ([DELETE] /specialtys/:id)
    
    </br>

- Autenticação de usuários via JWT ([POST] /tokens)

## Tecnologias:
Ferramentas usadas na construção do backend:

- Typescript
- Node.js (v22.13.1)
- Express
- MongoDB Atlas
- Prisma
