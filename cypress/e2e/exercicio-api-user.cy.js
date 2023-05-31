/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Teste da Funcionalidade Produtos', () => {
    //variável
    let token
    before(() => {
        //passando o email, e o token gerado para uma variável
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Deve validar contrato de usuários', () => {
        //TODO: 
        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar usuários cadastrados', () => {
        //TODO:
        cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(15)
        })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        //TODO: 
        let usuario = `teste${Math.floor(Math.random() * 1000)}@com.br`
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "administrador": "true",
                "email": usuario,
                "nome": "teste",
                "password": "teste@123"
            },
            headers: { authorization: token }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })

    });

    it('Deve validar um usuário com email inválido', () => {
        //TODO: 
        cy.cadastrarUsuario(token, "fulano", "fulano.com.br", "password", "true")
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.email).to.equal('email deve ser um email válido')
            });
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        //TODO: 
        cy.request('usuarios').then(response => {
            cy.log(response.body.usuarios[0]._id)
            let id = response.body.usuarios[0]._id
            let email = response.body.usuarios[0].email
            cy.request({
                method: 'PUT',
                url: `usuarios/${id}`,
                headers: { authorization: token },
                body: {
                    "administrador": "true",
                    "email": email,
                    "nome": "NomeUser",
                    "password": "teste"
                }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })

    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        //TODO: 
        let usuario = `usuario_${Math.floor(Math.random() * 1000)}@test.com`
        cy.cadastrarUsuario(token, "novo usuario", usuario, "teste", "true")
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token }
                }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
                })
            })
    });
});