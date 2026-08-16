import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Listar todas as locações
app.get('/api/locacoes', async (_req: Request, res: Response): Promise<void> => {
  try {
    const locacoes = await prisma.locacao.findMany({
      include: { itens: true, itensDevolvidos: true },
      orderBy: { id: 'desc' }
    });
    res.json(locacoes);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar locações: ' + error.message });
  }
});

// Buscar locação por ID
app.get('/api/locacoes/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido.' });
      return;
    }

    const locacao = await prisma.locacao.findUnique({
      where: { id },
      include: { itens: true, itensDevolvidos: true }
    });

    if (!locacao) {
      res.status(404).json({ error: 'Locação não encontrada.' });
      return;
    }

    res.json(locacao);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao buscar locação: ' + error.message });
  }
});

// Cadastrar nova locação
app.post('/api/locacoes', async (req: Request, res: Response): Promise<void> => {
  try {
    const { itens = [], id, itensDevolvidos, ...dadosLocacao } = req.body;

    const nova = await prisma.locacao.create({
      data: {
        ...dadosLocacao,
        valorTotal: Number(dadosLocacao.valorTotal) || 0,
        dataInicio: new Date(dadosLocacao.dataInicio),
        dataFim: new Date(dadosLocacao.dataFim),
        itens: {
          create: itens.map((item: { nomeEquipamento: string; quantidade: number }) => ({
            nomeEquipamento: item.nomeEquipamento,
            quantidade: Number(item.quantidade)
          }))
        }
      },
      include: { itens: true }
    });

    res.json(nova);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao criar locação: ' + error.message });
  }
});

// Atualizar locação existente
app.put('/api/locacoes/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { itens = [], itensDevolvidos, id: bodyId, ...dadosLocacao } = req.body;

    const atualizada = await prisma.locacao.update({
      where: { id },
      data: {
        ...dadosLocacao,
        valorTotal: Number(dadosLocacao.valorTotal) || 0,
        dataInicio: new Date(dadosLocacao.dataInicio),
        dataFim: new Date(dadosLocacao.dataFim)
      },
      include: { itens: true }
    });

    res.json(atualizada);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao atualizar locação: ' + error.message });
  }
});

// Renovar prazo da locação
app.patch('/api/locacoes/:id/renovar', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { dias } = req.body;

    const loc = await prisma.locacao.findUnique({ where: { id } });
    if (!loc) {
      res.status(404).json({ error: 'Locação não encontrada.' });
      return;
    }

    const novaDataFim = new Date(loc.dataFim);
    novaDataFim.setDate(novaDataFim.getDate() + Number(dias));

    const atualizado = await prisma.locacao.update({
      where: { id },
      data: { dataFim: novaDataFim }
    });

    res.json(atualizado);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao renovar locação: ' + error.message });
  }
});

// Registrar baixa parcial de equipamento
app.post('/api/locacoes/:id/baixa', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { indexItem, quantidadeDevolver } = req.body;

    const loc = await prisma.locacao.findUnique({
      where: { id },
      include: { itens: true }
    });

    if (!loc || !loc.itens[indexItem]) {
      res.status(400).json({ error: 'Item não encontrado.' });
      return;
    }

    const item = loc.itens[indexItem];
    const qtdDevolver = Number(quantidadeDevolver);

    await prisma.itemDevolvido.create({
      data: {
        nomeEquipamento: item.nomeEquipamento,
        quantidade: qtdDevolver,
        locacaoId: id
      }
    });

    if (item.quantidade <= qtdDevolver) {
      await prisma.itemLocacao.delete({ where: { id: item.id } });
    } else {
      await prisma.itemLocacao.update({
        where: { id: item.id },
        data: { quantidade: item.quantidade - qtdDevolver }
      });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao dar baixa: ' + error.message });
  }
});

// Encerrar locação
app.patch('/api/locacoes/:id/encerrar', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const encerrado = await prisma.locacao.update({
      where: { id },
      data: { status: 'Encerrada' }
    });

    res.json(encerrado);
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao encerrar locação: ' + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Back-end Sergamix rodando na porta ${PORT}`));