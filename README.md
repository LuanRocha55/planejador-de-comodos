# Multi-Room Architecture Planner

Planejador 2D de cômodos e móveis que roda direto no navegador. Monte a planta de cada cômodo, arraste e gire os móveis, mova portas e janelas e exporte o resultado em PNG.

Sem backend e sem build obrigatório: é um site estático (HTML, CSS e JavaScript puro).

## Funcionalidades

- **Vários cômodos:** Quarto Solteiro (4,0 × 3,0 m), Quarto Casal (4,5 × 3,5 m) e Sala de Estar (5,0 × 4,0 m) já configurados, mais a criação de cômodos com medidas livres.
- **Móveis:**
  - Arrastar e soltar, com encaixe magnético nas paredes.
  - Girar 90° com o botão ou a tecla `R`, com animação.
  - Redimensionar pelo editor lateral ou pela alça no canvas.
  - Detecção de colisão entre móveis e aviso quando algo bloqueia a abertura da porta.
- **Portas e janelas:** arraste ao longo da parede ou leve para outra parede; adicione janelas com `+ Janela`.
- **Catálogo e móveis personalizados:** itens prontos com medidas reais e criação de móveis com nome, medidas e cor.
- **Árvore do projeto (camadas):** Cômodo > Portas e Janelas / Móveis, com opções para ocultar e travar cada item.
- **Exportar PNG:** baixa a planta do cômodo atual em alta resolução.
- **Salvamento automático:** o projeto fica guardado no `localStorage` do navegador.

## Como usar

### Localmente

Baixe ou clone o repositório e abra o `index.html` no navegador. Não precisa instalar nada.

```bash
git clone https://github.com/LuanRocha55/planejador-de-comodos.git
cd planejador-de-comodos
# abra o index.html no navegador
```

### Publicar no GitHub Pages

1. No repositório, abra **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)` e salve.
4. Depois de alguns minutos, o app fica disponível em `https://luanrocha55.github.io/planejador-de-comodos/`.

## Desenvolvimento

O CSS do Tailwind já vem compilado em `css/tailwind.css`, então o app funciona sem nenhuma etapa de build. Só é preciso recompilar se você usar classes do Tailwind que ainda não aparecem no HTML ou no JS.

```bash
npm install
npm run build:css   # gera css/tailwind.css minificado
npm run watch:css   # recompila automaticamente enquanto você edita
```

## Estrutura

```
.
├── index.html              # estrutura da interface
├── css/
│   ├── tailwind.css        # utilitários do Tailwind (gerado, não editar)
│   └── styles.css          # estilos próprios (fontes e barras de rolagem)
├── js/
│   └── app.js              # lógica: canvas, cômodos, móveis, camadas e exportação
├── src/
│   └── tailwind.input.css  # entrada do Tailwind para o build
├── tailwind.config.js
├── package.json
└── favicon.svg
```

## Limitações conhecidas

- O projeto fica salvo apenas no navegador e no endereço onde foi aberto. Trocar de navegador, limpar os dados de navegação ou passar do arquivo local para o GitHub Pages começa um projeto novo.
- A interface foi pensada para desktop. No celular ela abre, mas o espaço é apertado.
- As fontes Inter e JetBrains Mono vêm do Google Fonts. Sem internet, o app usa as fontes do sistema.

## Origem

Criado em setembro de 2026 a partir de prototipação com o Gemini Canvas e organizado em arquivos separados em novembro de 2026.
