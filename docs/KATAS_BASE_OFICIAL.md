# Base Oficial De Dados Dos Katas - Atarashii App

## Objetivo

Estruturar os katas do Karate Shotokan como base reutilizavel para o app, preservando o conteudo da apostila e registrando pendencias para validacao.

## Fonte Principal

- PDF: `apostila karate.pdf`
- Trechos principais: paginas 5 a 11, com lista dos 26 katas, significados, movimentos, tempo e kiai.
- `Taikyoku Shodan` foi incluido como opcional de produto, mas nao aparece na lista dos 26 katas da apostila.

## Lista Estruturada

| Kata | Nivel | Faixa sugerida | Movimentos | Tempo | Video |
|---|---|---|---:|---|---|
| Taikyoku Shodan | Fundamentos (Kyu) | Branca / introdutoria, opcional conforme associacao | 20 aproximados | 30 a 40 segundos | Video oficial pendente de cadastro. |
| Heian Shodan | Fundamentos (Kyu) | Branca | 21 | 30 a 40 segundos | Video oficial pendente de cadastro. |
| Heian Nidan | Fundamentos (Kyu) | Amarela | 26 | Aproximadamente 40 segundos | Video oficial pendente de cadastro. |
| Heian Sandan | Fundamentos (Kyu) | Vermelha | 20 | Aproximadamente 40 segundos | Video oficial pendente de cadastro. |
| Heian Yondan | Fundamentos (Kyu) | Laranja | 27 | Aproximadamente 50 segundos | Video oficial pendente de cadastro. |
| Heian Godan | Fundamentos (Kyu) | Verde | 23 | Aproximadamente 50 segundos | Video oficial pendente de cadastro. |
| Tekki Shodan | Intermediarios | Marrom inicial | 29 | 40 a 50 segundos | Video oficial pendente de cadastro. |
| Bassai Dai | Intermediarios | Marrom | 42 | Aproximadamente 60 segundos | Video oficial pendente de cadastro. |
| Kanku Dai | Avancados | Marrom avancada / preta inicial | 65 | Aproximadamente 90 segundos | Video oficial pendente de cadastro. |
| Empi | Avancados | Preta inicial | 37 | Aproximadamente 50 segundos | Video oficial pendente de cadastro. |
| Jion | Avancados | Preta inicial | 47 | Aproximadamente 60 segundos | Video oficial pendente de cadastro. |
| Hangetsu | Avancados | Preta | 41 | Aproximadamente 60 segundos | Video oficial pendente de cadastro. |
| Jitte | Avancados | Preta | 24 | Aproximadamente 60 segundos | Video oficial pendente de cadastro. |
| Gankaku | Avancados | Preta | 42 | 50 a 70 segundos | Video oficial pendente de cadastro. |
| Tekki Nidan | Superiores (Faixa Preta) | Preta | 24 | Aproximadamente 35 segundos | Video oficial pendente de cadastro. |
| Tekki Sandan | Superiores (Faixa Preta) | Preta | 36 | Aproximadamente 40 segundos | Video oficial pendente de cadastro. |
| Bassai Sho | Superiores (Faixa Preta) | Preta | 27 | Aproximadamente 60 segundos | Video oficial pendente de cadastro. |
| Kanku Sho | Superiores (Faixa Preta) | Preta | 48 | Aproximadamente 60 segundos | Video oficial pendente de cadastro. |
| Nijushiho | Superiores (Faixa Preta) | Preta | 34 | Aproximadamente 90 segundos | Video oficial pendente de cadastro. |
| Chinte | Superiores (Faixa Preta) | Preta | 33 | 60 a 90 segundos | Video oficial pendente de cadastro. |
| Sochin | Superiores (Faixa Preta) | Preta | 40 | Aproximadamente 60 segundos | Video oficial pendente de cadastro. |
| Meikyo | Superiores (Faixa Preta) | Preta | 34 | Aproximadamente 45 segundos | Video oficial pendente de cadastro. |
| Wankan | Superiores (Faixa Preta) | Preta | 24 | 30 a 45 segundos | Video oficial pendente de cadastro. |
| Unsu | Superiores (Faixa Preta) | Preta avancada | 48 | 60 a 90 segundos | Video oficial pendente de cadastro. |
| Gojushiho Dai | Superiores (Faixa Preta) | Preta avancada | 67 | 60 a 70 segundos | Video oficial pendente de cadastro. |
| Gojushiho Sho | Superiores (Faixa Preta) | Preta avancada | 65 | 60 a 70 segundos | Video oficial pendente de cadastro. |
| Jiin | Superiores (Faixa Preta) | Preta | 35 | 50 a 65 segundos | Video oficial pendente de cadastro. |

## Divergencias E Observacoes

- A apostila trabalha com 26 katas tradicionais; a base do app possui 27 registros por incluir `Taikyoku Shodan` como opcional.
- Grafias normalizadas para o app: `Hein Nidan` -> `Heian Nidan`, `Teki Sandan` -> `Tekki Sandan`, `Enpi` -> `Empi`.
- A apostila nao informa os pontos de kiai de `Chinte`; o campo fica pendente.
- `Gojushiho Dai` e `Gojushiho Sho` podem ter variacao de nomenclatura/ordem entre organizacoes; validar com a Associacao Atarashii.

## Tela Detalhe Do Kata

Conteudos: nome, nome japones, significado, pronuncia, faixa, nivel, foto/ilustracao, player YouTube, historico, objetivos, informacoes tecnicas, tecnicas, bases, embusen, bunkai, curiosidades, erros comuns, checklist, favoritar, marcar como estudado, barra de progresso, kata anterior e proximo kata.

Comportamento: se houver `youtube_video_url`, mostrar player incorporado. Se nao houver, mostrar imagem/embusen ou aviso de video pendente. A navegacao anterior/proximo usa `ordem_tradicional_aprendizado`.

## Modelagem Relacional Futura

Tabelas sugeridas: `kata`, `tecnica`, `kata_tecnica`, `base`, `kata_base`, `bunkai`, `video`, `associacao`, `usuario`, `progresso`, `favoritos`, `historico_estudo`, `quiz`.

Relacionamentos principais: um kata possui muitos bunkai, videos, tecnicas e bases; usuarios possuem muitos progressos, favoritos e historicos de estudo; quiz pode ser geral ou vinculado a kata.

## JSON Ou Banco De Dados?

Recomendacao atual: usar JSON para conteudo publico de katas, tecnicas, bases e glossario, pois muda pouco, funciona sem login e pode ser versionado no GitHub.

Usar banco em nuvem, como Supabase/Firebase, quando houver dados dinamicos ou privados: Area do Aluno, presencas, faltas, feedbacks, favoritos sincronizados, progresso por usuario e painel do Sensei.

Arquitetura recomendada: conteudo publico em JSON; dados privados em banco; videos como links oficiais do YouTube cadastrados na base.

## Arquivo Gerado

`data/katas-shotokan-complete.json`
