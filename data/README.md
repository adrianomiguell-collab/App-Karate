# Dados Do MVP

Esta pasta contem a primeira estrutura de dados em JSON para o App Karate Shotokan.

## Arquivos

- `content-items.json`: conteudos conceituais, historicos e formativos.
- `techniques.json`: tecnicas basicas citadas na apostila.
- `stances.json`: bases/Dachi citadas na apostila.
- `katas.json`: katas iniciais definidos para o MVP.
- `glossary.json`: termos japoneses e conceitos de consulta.
- `rules.json`: regras essenciais de Kumite e Kata.
- `quiz.json`: quiz inicial com 50 questoes da apostila.

## Assets Visuais

- `assets/bases/`: paginas visuais com bases/Dachi.
- `assets/katas/`: diagramas/embusen dos katas iniciais.
- `assets/rules/`: tabelas e imagens de apoio para regras/arbitragem.

## Convencoes

- `id`: identificador estavel para relacionamentos internos.
- `slug`: identificador amigavel para rotas.
- `level`: nivel recomendado do conteudo.
- `relatedIds`: ids de conteudos relacionados.
- `sourcePages`: paginas da apostila usadas como origem quando mapeadas.
- `videoUrl`: link de video quando houver.
- `videoProvider`: provedor do video, por exemplo `youtube`.
- `associationVideoUrl`: link oficial da Associacao Atarashii quando houver.
- `instructorNotes`: observacoes futuras do instrutor.
- `practiceChecklist`: lista futura de pontos de pratica.

## Observacoes

- Imagens e diagramas foram adicionados depois da validacao de direito de uso.
- O conteudo foi sintetizado para uso educacional no app.
- O Sensei Online e recursos de IA nao entram no MVP.
- Katas e Kihon devem aceitar videos oficiais em fases futuras sem alterar a estrutura principal.
