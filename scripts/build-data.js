const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const desserts = [
  { name: '蛋黄千层酥', price: '15/盒', image: 'image1.png' },
  { name: '大福', price: '15/盒', image: 'image2.png' },
  { name: '谷物全麦吐司', price: '15/袋', image: 'image3.png' },
  { name: '蛋奶曲奇饼', price: '7/盒', image: 'image4.png' },
  { name: '趣多多曲奇', price: '10/盒', image: 'image5.png' },
  { name: '牛角包', price: '13/袋', image: 'image6.png' },
  { name: '菠萝包', price: '5元一个', image: 'image7.png' },
  { name: '瑞士卷', price: '15/盒', image: 'image8.png' },
  { name: '花纹蛋糕', price: '18/斤', image: 'image9.png' },
  { name: '古早蛋糕', price: '18/斤', image: 'image10.png' },
  { name: '雪媚娘', price: '8/盒', image: 'image11.png' },
  { name: '啵啵杯', price: '8/杯', image: 'image12.png' },
  { name: '华夫碗', price: '8/碗', image: 'image13.png' },
  { name: '水果泡芙', price: '15/盒', image: 'image14.png' },
  { name: '蛋挞', price: '10/六个', image: 'image15.png' },
  { name: '爆浆泡芙', price: '10/盒', image: 'image16.png' },
  { name: '手工蛋卷', price: '9/盒', image: 'image17.png' },
  { name: '紫薯薄饼', price: '7/10一盒', image: 'image18.png' },
];

const cakeNames = [
  '草莓巧克力卷围边蛋糕', '草莓香橙生日蛋糕', '大眼饼干碎蛋糕', '气球小熊红心蛋糕',
  '三层福寿庆典蛋糕', '福如东海寿桃蛋糕', '寿桃福寿爷爷蛋糕', '红金酒瓶主题蛋糕',
  '彩虹甜心双层蛋糕', '星翼凯蒂猫蛋糕', '风车城堡公主蛋糕', '彩虹小猪一家蛋糕',
  '爱妈妈缤纷水果蛋糕', '爸爸生日祝福蛋糕', '粉蝶结公主城堡蛋糕', '月亮哆啦A梦蛋糕',
  '深蓝星空宇航员蛋糕', '银白月球宇航员蛋糕', '月亮城堡蝴蝶结蛋糕', '红黑篮筐少年蛋糕',
  '蓝金加油少年篮球蛋糕', '银冠双层水果蛋糕', '双层缤纷水果生日蛋糕', '花边四季水果蛋糕',
  '金芒柠檬裱花蛋糕', '莓果黑饼干生日蛋糕', '巧克力碎片莓果蛋糕', '芒果火龙果双拼蛋糕',
  '小熊草莓饼干蛋糕', '前程似锦水果蛋糕', '草莓蓝莓饼干花环蛋糕', '青提草莓夹心饼干蛋糕',
  '红金篮球派对蛋糕', '凯蒂猫彩珠生日蛋糕', '篮球小队饼干碎蛋糕', '兔耳女孩糖果蛋糕',
  '彩球字母生日蛋糕', '黄色工程车蛋糕', '草莓雪花蛋糕', '星星云朵小萌娃蛋糕',
  '红心金烛蛋糕', '草莓蓝莓花园蛋糕', '福字草莓祝寿蛋糕', '金元宝暴富蛋糕',
  '熊猫乐园围边蛋糕', '蓝云哆啦A梦蛋糕', '粉晶蓝莓蛋糕', '蓝莓青提双拼蛋糕',
  '蓝莓小雏菊蛋糕', '红福双莓生日蛋糕', '芒果葡萄红丝带蛋糕', '蓝莓饼干花环蛋糕',
  '饼干怪兽小熊蛋糕',
];

const cakes = cakeNames.map((name, idx) => ({
  name,
  price: '六到十二寸均可',
  image: `image${idx + 19}.png`,
}));

const data = {
  shop: {
    name: '贝焙面包',
    slogan: '烘焙之美，始于贝焙。',
    phone: '19519196868',
  },
  categories: [
    { id: 'desserts', name: '甜品类', items: desserts },
    { id: 'cakes', name: '蛋糕类', items: cakes },
  ],
};

fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data', 'products.json'), JSON.stringify(data, null, 2));
console.log('products.json written', desserts.length, cakes.length);
