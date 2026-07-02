# Evolucao De Midia Na Secao Treinar

## Objetivo

Registrar a evolucao futura da secao Treinar para permitir demonstracoes visuais por GIF, imagem e video nos itens tecnicos do Atarashii App.

## Contexto

Na secao Treinar, itens como Oi-Zuki, Gyaku-Zuki, Age-Uke, Kiba-Dachi e outros podem ser muito mais didaticos quando acompanhados de uma demonstracao visual curta.

A proposta e permitir que cada tecnica, defesa, ataque, chute ou base tenha um GIF demonstrando o movimento, alem de descricao textual.

## Escopo Futuro

Cada item tecnico podera conter:

- nome;
- tipo: soco, chute, defesa, golpe ou base;
- descricao;
- pontos de atencao;
- erros comuns;
- GIF demonstrativo;
- imagem de apoio;
- video oficial da associacao;
- checklist de pratica;
- observacoes do instrutor.

## Diretriz Para GIFs

GIFs devem ser usados para demonstracoes curtas e objetivas.

Preferencias:

- usar GIFs proprios ou autorizados pela Associacao Atarashii;
- manter arquivos leves para uso em celular;
- priorizar tecnicas basicas do MVP antes de tecnicas avancadas;
- nao depender apenas do GIF para ensinar a tecnica;
- sempre manter aviso de que a pratica deve ser orientada pelo sensei.

## Organizacao Dos Arquivos

Midias de treino devem ficar em pastas especificas de treino, nunca soltas na raiz do projeto.

- prototipo web: `assets/training/`
- app mobile Expo: `mobile/src/assets/training/`

Exemplo atual:

- `assets/training/mae_geri.png`
- `mobile/src/assets/training/mae_geri.png`

O campo usado nos dados deve ser `imageUrl` para imagem estatica e `gifUrl` para GIF futuro. Para manter compatibilidade entre web e mobile, usar o mesmo caminho logico nos JSONs: `assets/training/mae_geri.png`.
## Estrutura De Dados Recomendada

```json
{
  "id": "oi-zuki",
  "name": "Oi-Zuki",
  "type": "soco",
  "description": "Soco direto executado com o punho da perna da frente.",
  "gifUrl": "assets/gifs/oi-zuki.gif",
  "imageUrl": null,
  "videoUrl": null,
  "associationVideoUrl": null,
  "attentionPoints": [
    "Manter postura alinhada",
    "Sincronizar deslocamento e soco",
    "Executar com controle"
  ],
  "commonMistakes": [
    "Inclinar o tronco",
    "Perder a base",
    "Estender o braco sem conexao com o quadril"
  ],
  "practiceChecklist": []
}
```

## Priorizacao

### Fase Inicial

- manter descricao textual;
- preparar campo `gifUrl` nos dados;
- permitir que a tela ignore o campo quando estiver vazio.

### Fase Seguinte

- adicionar GIFs para tecnicas basicas;
- adicionar pontos de atencao;
- adicionar erros comuns.

### Fase Posterior

- adicionar videos oficiais da associacao;
- relacionar tecnicas com trilhas por faixa;
- adicionar checklist de pratica.

## Itens Prioritarios Para GIF

- Oi-Zuki;
- Gyaku-Zuki;
- Mae-Geri;
- Yoko-Geri;
- Mawashi-Geri;
- Age-Uke;
- Soto-Uke;
- Uchi-Uke;
- Gedan-Barai;
- Shuto-Uke;
- Kiba-Dachi;
- Zenkutsu-Dachi;
- Kokutsu-Dachi.

## Decisao

A secao Treinar deve evoluir para combinar texto, imagem, GIF e video, mantendo a arquitetura preparada desde o MVP.

