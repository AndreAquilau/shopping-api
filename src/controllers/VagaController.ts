import { getRepository } from 'typeorm';
import { Response, Request } from 'express';
import { isPast } from 'date-fns';
import Vaga from '@model/Vaga';
import Mesa from '@model/Mesa';

class VagaController {
  async index(resquest: Request, response: Response): Promise<any> {
    try {
      const repository = getRepository(Vaga);
      const res = await repository.find();

      return response.status(200).json({
        vagas: res,
      });
    } catch (err) {
      return response.status(500).json({
        errors: [err],
      });
    }
  }

  async show(resquest: Request, response: Response): Promise<any> {
    try {
      const { id } = resquest.params;
      const repository = getRepository(Vaga);
      const res = await repository.findOne({ where: { id: Number(id) } });

      return response.status(200).json({
        vaga: res,
      });
    } catch (err) {
      return response.status(500).json({
        errors: [err],
      });
    }
  }

  async store(resquest: Request, response: Response): Promise<any> {
    try {
      const { empresa, mesa, cpf, expires, expiresIni } = resquest.body;
      const repository = getRepository(Vaga);
      const repositoryMesa = getRepository(Mesa);

      const res = await repository
        .save({
          mesa,
          empresa,
          cpf,
          expires: new Date(expires),
          expiresIni: new Date(expiresIni),
        })
        .then(async () => {
          await repositoryMesa.update({ id: mesa.id }, { ocupada: true });
        });

      return response.status(201).json({
        vaga: res,
      });
    } catch (err) {
      return response.status(500).json({
        errors: [err],
      });
    }
  }

  async update(resquest: Request, response: Response): Promise<any> {
    try {
      const { id } = resquest.params;
      const repository = getRepository(Vaga);
      const res = await repository.update({ id: Number(id) }, resquest.body);

      return response.status(200).json({
        vaga: res,
      });
    } catch (err) {
      return response.status(500).json({
        errors: [err],
      });
    }
  }

  async delete(resquest: Request, response: Response): Promise<any> {
    try {
      const { id } = resquest.params;
      const repository = getRepository(Vaga);
      const res = await repository.delete({ id: Number(id) });

      return response.status(200).json({
        user: res,
      });
    } catch (err) {
      return response.status(500).json({
        errors: [err],
      });
    }
  }

  async verificar(resquest: Request, response: Response): Promise<any> {
    try {
      const repository = getRepository(Vaga);
      const repositoryMesa = getRepository(Mesa);
      const res = await repository.find().then(async (vagas) => {
        vagas.filter(async (vaga, index, array) => {
          if (isPast(new Date(vaga.expires)) && vaga.confirmado === false) {
            await repositoryMesa.update({ id: vaga.id }, { ocupada: false });
          }
        });
      });

      return response.status(200);
    } catch (err) {
      return response.status(500).json({
        errors: [err],
      });
    }
  }
}

export default new VagaController();
