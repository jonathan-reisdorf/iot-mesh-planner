export default {
  drawBackground() {
    const { ctx, offset } = this;
    if (!this.background) {
      return;
    }

    return new Promise(resolve => {
      const img = new Image();
      img.onload = () =>
        resolve(
          ctx.drawImage(
            img,
            0,
            0,
            img.naturalWidth,
            img.naturalHeight,
            offset,
            offset,
            this.width,
            this.height
          )
        );
      img.src = this.background;
    });
  },
  drawNodes() {
    const { ctx } = this;
    ctx.setLineDash([]);

    return [...this.nodes]
      .map((node, index) => ({
        ...node,
        centerX: Math.round((node.x / 100) * this.width + this.offset),
        centerY: Math.round((node.y / 100) * this.height + this.offset),
        iw: 1 - 1 / (index + 1)
      }))
      .sort(({ smart: a, iw: iwa }, { smart: b, iw: iwb }) => {
        let ar = iwa;
        let br = iwb;
        a === 'hub' && (ar += 100);
        b === 'hub' && (br += 100);
        a === 'active' && (ar += 10);
        b === 'active' && (br += 10);
        a === 'passive' && (ar += 1);
        b === 'passive' && (br += 1);
        return br > ar ? -1 : 1;
      })
      .reduce(async (prev, node) => {
        await prev;
        ctx.strokeStyle = node.smart ? '#004e85' : '#4b413f';
        ctx.fillStyle = node.background || '#dddddd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.centerX, node.centerY, 24, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        return this.drawNodeIcon(node);
      }, null);
  },
  async drawNodeIcon(node) {
    await this.drawSVG({
      iconEl: this.$refs[`icon_${node.icon}`].$el,
      width: 32,
      height: 32,
      fill: node.smart && !node.extension ? '#004e85' : '#4b413f',
      x: node.centerX,
      y: node.centerY
    });

    node.smart && node.extension && (await this.drawWirelessIcon(node));
    node.note && (await this.drawNoteIcon(node));
  },
  async drawWirelessIcon(node) {
    const { ctx } = this;
    const x = node.centerX + 16;
    const y = node.centerY - 16;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fill();

    await this.drawSVG({
      iconEl: this.$refs.icon_wireless.$el,
      width: 24,
      height: 24,
      fill: '#004e85',
      x,
      y
    });
  },
  async drawNoteIcon(node) {
    const x = node.centerX;
    const y = node.centerY - 20;

    await this.drawSVG({
      iconEl: this.$refs.icon_note.$el,
      width: 20,
      height: 20,
      fill: '#e8a87c',
      strokeWidth: '8px',
      x,
      y
    });
  },
  drawSVG({ iconEl, width, height, fill, strokeWidth = 0, x, y }) {
    const { ctx } = this;
    const viewBox = (
      (iconEl.outerHTML.match(/viewBox="([\d\s]+)"/) || []).pop() || ''
    ).split(' ');
    iconEl.setAttribute('width', iconEl.style.width || viewBox[2] - viewBox[0]);
    iconEl.setAttribute(
      'height',
      iconEl.style.height || viewBox[3] - viewBox[1]
    );
    iconEl.style.fill = fill;
    iconEl.style.stroke = strokeWidth ? '#ffffff' : 'none';
    iconEl.style.strokeWidth = strokeWidth;

    const url = new XMLSerializer().serializeToString(iconEl);
    const img = new Image();

    return new Promise(resolve => {
      img.onload = () => {
        resolve(
          ctx.drawImage(
            img,
            0,
            0,
            img.naturalWidth,
            img.naturalHeight,
            x - width / 2,
            y - height / 2,
            width,
            height
          )
        );
      };
      img.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(url)}`;
    });
  }
};
