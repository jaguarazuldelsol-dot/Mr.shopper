import { useState, useMemo } from "react";
import { ShoppingCart, Search, X, ChevronDown, Check } from "lucide-react";

// ── CATEGORY CONFIG ───────────────────────────────────────────────────────────
const CC = {
  "Lácteos":    { c:"#2563eb", bg:"#dbeafe", i:"🥛" },
  "Proteína":   { c:"#dc2626", bg:"#fee2e2", i:"🥩" },
  "Granos":     { c:"#d97706", bg:"#fef3c7", i:"🌾" },
  "Enlatados":  { c:"#7c3aed", bg:"#ede9fe", i:"🥫" },
  "Aceites":    { c:"#ea580c", bg:"#ffedd5", i:"🫙" },
  "Condimentos":{ c:"#0891b2", bg:"#cffafe", i:"🧂" },
  "Panadería":  { c:"#92400e", bg:"#fef3c7", i:"🍞" },
  "Bebidas":    { c:"#0369a1", bg:"#e0f2fe", i:"🥤" },
  "Snacks":     { c:"#be185d", bg:"#fce7f3", i:"🍿" },
  "Limpieza":   { c:"#059669", bg:"#d1fae5", i:"✨" },
  "Higiene":    { c:"#7c3aed", bg:"#ede9fe", i:"🧼" },
  "Bebés":      { c:"#db2777", bg:"#fce7f3", i:"👶" },
  "Mascotas":   { c:"#65a30d", bg:"#ecfccb", i:"🐾" },
  "Farmacia":   { c:"#0f766e", bg:"#ccfbf1", i:"💊" },
  "Congelados": { c:"#1d4ed8", bg:"#dbeafe", i:"❄️" },
  "Especias":   { c:"#15803d", bg:"#dcfce7", i:"🌿" },
};
const DC = { c:"#6366f1", bg:"#e0e7ff", i:"📦" };

// verdict: 0=igual 1=similar 2=diferente
// nut arrays: [cal,prot,carbs,fat,sugar,sodium]
const PRODUCTS = [
  ["lec","Lácteos","Leche entera 1L","Lala/Nestlé",0,"Composición idéntica. Mejor ahorro del súper.",[150,8,12,8,12,115],[150,8,12,8,12,115]],
  ["lec2","Lácteos","Leche descremada 1L","Lala/Alpura",0,"Mismo proceso, misma reducción de grasa.",[90,8,12,0,12,130],[90,8,12,0,12,130]],
  ["man","Lácteos","Mantequilla 200g","Lurpak/Lala",1,"Para cocinar igual; para untar nota la diferencia.",[100,0,0,11,0,90],[100,0,0,11,0,95]],
  ["que","Lácteos","Queso amarillo rebanado","Kraft",1,"Similar en fusión. Textura varía un poco.",[80,5,1,7,0,410],[75,4,1,6,0,430]],
  ["yog","Lácteos","Yogurt natural 1kg","Danone/Yoplait",1,"Menos cultivos declarados pero funcional.",[100,17,6,1,6,95],[90,14,7,1,7,85]],
  ["cre","Lácteos","Crema ácida 200g","Lala/Nestlé",0,"Idéntica en composición.",[60,1,2,6,1,15],[60,1,2,6,1,18]],
  ["qpa","Lácteos","Queso panela 400g","Lala/Alpura",0,"Ahorra sin dudar.",[70,7,1,4,0,200],[70,7,1,4,0,210]],
  ["hue","Proteína","Huevos blancos 12pz","Bachoco",0,"Un huevo es un huevo. Idéntico.",[70,6,0,5,0,70],[70,6,0,5,0,70]],
  ["jamo","Proteína","Jamón de pavo 200g","FUD",1,"Similar en sabor y textura.",[60,8,2,2,0,580],[55,7,2,2,0,600]],
  ["sal","Proteína","Salchichas 400g","FUD/Bafar",1,"Para caldos igual. Para hotdog nota diferencia.",[180,7,2,16,0,540],[170,6,2,15,0,560]],
  ["atu","Proteína","Atún en agua 140g","Dolores/StarKist",1,"Puede tener más agua y menos trozo sólido.",[100,22,0,1,0,320],[90,20,0,1,0,350]],
  ["sar","Proteína","Sardinas en tomate 125g","Calmex",0,"Diferencia mínima.",[150,14,3,9,0,380],[148,13,3,9,0,400]],
  ["arr","Granos","Arroz blanco 1kg","La Costeña",0,"Arroz es arroz. Mejor cambio del súper.",[130,3,28,0,0,1],[130,3,28,0,0,1]],
  ["pas","Granos","Pasta spaghetti 500g","Barilla",1,"Para salsas espesas imperceptible.",[352,13,70,2,3,6],[350,12,71,1,3,8]],
  ["avi","Granos","Avena hojuelas 500g","Quaker",0,"Avena es avena.",[150,5,27,3,1,0],[150,5,27,3,1,0]],
  ["len","Granos","Lentejas 500g","La Costeña",0,"Legumbre sin procesar. Idéntica.",[116,9,20,0,0,2],[116,9,20,0,0,2]],
  ["fri","Granos","Frijoles negros 400g","La Costeña",0,"Ahorra aquí siempre.",[110,7,20,1,0,390],[110,7,19,1,0,420]],
  ["gar","Granos","Garbanzos 400g","Del Monte",0,"Legumbre enlatada idéntica.",[120,7,22,2,0,320],[120,7,22,2,0,340]],
  ["tor","Granos","Tortillas maíz 30pz","Maseca/Tía Rosa",0,"Misma masa nixtamalizada.",[50,1,10,1,0,15],[50,1,10,1,0,18]],
  ["tom","Enlatados","Salsa de tomate 400g","Del Monte",0,"Para cocinar idéntica.",[40,2,9,0,6,350],[38,2,9,0,6,380]],
  ["pur","Enlatados","Puré de tomate 400g","Herdez",0,"Idéntico en cocina.",[35,1,8,0,5,20],[35,1,8,0,5,25]],
  ["chi","Enlatados","Chiles chipotles 220g","La Costeña",1,"Puede ser menos ahumado.",[25,1,4,0,2,430],[22,1,4,0,2,450]],
  ["elote","Enlatados","Elote en grano 400g","Del Monte",0,"Maíz dulce idéntico.",[70,2,15,1,5,290],[70,2,15,1,5,310]],
  ["ace","Aceites","Aceite vegetal 1L","Nutrioli/Crisco",0,"Cambia sin dudar.",[120,0,0,14,0,0],[120,0,0,14,0,0]],
  ["ace2","Aceites","Aceite de oliva 500ml","Bertolli",1,"Revisa etiqueta: puede mezclarse.",[120,0,0,14,0,0],[119,0,0,13,0,0]],
  ["saz","Condimentos","Sal de mesa 1kg","La Fina/Morton",0,"Sin diferencia posible.",[0,0,0,0,0,590],[0,0,0,0,0,590]],
  ["azu","Condimentos","Azúcar blanca 1kg","Zulka/Domino",0,"Sacarosa pura. Idéntica.",[15,0,4,0,4,0],[15,0,4,0,4,0]],
  ["cals","Condimentos","Caldo pollo 8 sobres","Knorr/Maggi",1,"Menos glutamato y sabor concentrado.",[15,1,2,0,0,860],[12,1,2,0,0,900]],
  ["may","Condimentos","Mayonesa 400g","Hellmann's",1,"Menos huevo real, más almidón.",[90,0,1,10,0,90],[85,0,2,9,0,100]],
  ["ket","Condimentos","Catsup 400g","Heinz/Del Monte",1,"Para cocinar el genérico funciona.",[20,0,5,0,4,160],[20,0,5,0,5,180]],
  ["mos","Condimentos","Mostaza 300g","French's",0,"Mostaza amarilla idéntica.",[5,0,0,0,0,120],[5,0,0,0,0,125]],
  ["pan","Panadería","Pan de caja blanco","Bimbo/Wonder",2,"Se endurece más rápido.",[70,2,13,1,2,130],[65,2,12,1,1,140]],
  ["pan2","Panadería","Pan integral","Bimbo",1,"Puede tener menos fibra real.",[80,3,14,1,2,140],[75,3,13,1,2,150]],
  ["gal","Panadería","Galletas de avena","Gamesa",1,"Para botanear igual.",[130,2,20,5,8,90],[125,2,19,5,8,95]],
  ["gal2","Panadería","Galletas saladas","Ritz/Club Social",1,"El genérico es menos crujiente.",[80,1,10,4,1,115],[75,1,10,3,1,120]],
  ["caf","Bebidas","Café molido 250g","Nescafé/Maxwell",2,"Aquí la marca sí importa.",[5,0,1,0,0,5],[5,0,1,0,0,5]],
  ["agu","Bebidas","Agua embotellada 1.5L","Ciel/Bonafont",0,"Mismos estándares. Ahorra siempre.",[0,0,0,0,0,0],[0,0,0,0,0,0]],
  ["jug","Bebidas","Jugo de naranja 1L","Tropicana/Del Valle",2,"Genérico tiene más azúcar añadida.",[110,2,26,0,22,0],[120,1,30,0,28,15]],
  ["te","Bebidas","Té negro 25 sobres","Lipton/Twinings",0,"Hojas de té. Proceso idéntico.",[0,0,0,0,0,0],[0,0,0,0,0,0]],
  ["ref","Bebidas","Refresco cola 2L","Coca-Cola/Pepsi",2,"Fórmulas únicas y patentadas.",[90,0,25,0,25,45],[85,0,24,0,24,40]],
  ["pap","Snacks","Papas fritas 150g","Sabritas/Lay's",1,"Menos sazón pero sirve.",[150,2,16,9,0,170],[145,2,16,9,0,185]],
  ["pop","Snacks","Palomitas microondas 3pz","Orville/Act II",1,"Menos mantequilla real.",[130,2,15,7,0,310],[125,2,15,7,0,330]],
  ["cho","Snacks","Chocolate oscuro 100g","Hershey's/Nestlé",1,"Menos cacao real.",[150,2,16,9,8,10],[145,2,16,9,9,12]],
  ["nut","Snacks","Nuez mixta 200g","Wonderful/Planters",0,"Sin procesar = sin diferencia.",[170,5,8,14,2,0],[170,5,8,14,2,0]],
  ["det","Limpieza","Detergente líquido 1L","Ariel/Tide",2,"Menos enzimas. No cambies para manchas fuertes.",null,null],
  ["lim","Limpieza","Limpiador multiusos 1L","Fabuloso/Pine-Sol",0,"Para superficies idéntico.",null,null],
  ["clo","Limpieza","Cloro 1L","Cloralex",0,"Hipoclorito de sodio. Idéntico.",null,null],
  ["pap2","Limpieza","Papel higiénico 4 rollos","Kleenex/Charmin",2,"Más delgado y áspero.",null,null],
  ["pap3","Limpieza","Papel de cocina 2 rollos","Bounty/Viva",1,"Absorbe menos por hoja.",null,null],
  ["sha","Higiene","Shampoo 400ml","Pantene/H&S",1,"Limpia igual, menos acondicionadores.",null,null],
  ["jab2","Higiene","Jabón de barra 3pz","Dove/Palmolive",0,"Para limpieza básica idéntico.",null,null],
  ["gel","Higiene","Gel antibacterial 500ml","Purell/Lysol",0,"Alcohol 70%. Idéntico.",null,null],
  ["pana","Bebés","Pañales talla M 40pz","Pampers/Huggies",1,"Puede filtrar más con mucha carga.",null,null],
  ["toll","Bebés","Toallitas húmedas 80pz","Pampers/Huggies",0,"Paño húmedo neutro. Idéntico.",null,null],
  ["pca","Mascotas","Croquetas perro 2kg","Purina/Pedigree",1,"Menor porcentaje de proteína.",null,null],
  ["pga","Mascotas","Croquetas gato 2kg","Purina/Whiskas",1,"El porcentaje de proteína importa.",null,null],
  ["pars","Farmacia","Paracetamol 500mg 20pz","Tempra/Tylenol",0,"Mismo principio activo por ley.",null,null],
  ["ibu","Farmacia","Ibuprofeno 400mg 20pz","Advil/Motrin",0,"Mismo principio activo por ley.",null,null],
  ["vit","Farmacia","Vitamina C 1000mg 30pz","Redoxon",0,"Ácido ascórbico. Idéntico.",null,null],
  ["cur","Farmacia","Curitas 40pz","Band-Aid/Nexcare",0,"Funciona igual.",null,null],
  ["hel","Congelados","Helado vainilla 1L","Häagen-Dazs/Nestlé",1,"Más aire y menos crema real.",[200,3,24,11,20,65],[180,2,25,9,20,70]],
  ["veg","Congelados","Verduras mixtas 500g","Del Monte/Birds Eye",0,"Verdura congelada idéntica.",[50,3,10,0,3,40],[50,3,10,0,3,45]],
  ["ore","Especias","Orégano 30g","McCormick",0,"Hierba seca. Sin diferencia.",[5,0,1,0,0,1],[5,0,1,0,0,1]],
  ["pimi","Especias","Pimienta negra 30g","McCormick",0,"Especia básica. Idéntica.",[6,0,1,0,0,1],[6,0,1,0,0,1]],
  ["cane","Especias","Canela molida 30g","McCormick",0,"Especia básica. Idéntica.",[6,0,2,0,0,0],[6,0,2,0,0,0]],
];

const COUNTRIES = [
  ["mx","México","🇲🇽","$","MXN",[
    ["wm","Walmart","Great Value"],["ch","Chedraui","Chedraui"],
    ["so","Soriana","Soriana"],["co","Costco","Kirkland"],
    ["ba","Bodega Aurrerá","Great Value"],["hb","HEB","Hill Country Fare"],
    ["sm","Súper Maz","Súper Maz"],["sl","Casa Ley","Casa Ley"],
    ["al","Alsuper","Alsuper"],["sp","Sam's Club","Member's Mark"],
    ["cal","Calimax","Calimax"],["lc","La Comer","La Comer"],
  ]],
  ["us","Estados Unidos","🇺🇸","$","USD",[
    ["wus","Walmart","Great Value"],["tg","Target","Good & Gather"],
    ["kr","Kroger","Kroger Brand"],["cus","Costco","Kirkland"],
    ["al2","ALDI","ALDI Brand"],["tr","Trader Joe's","Trader Joe's"],
    ["heb","H-E-B (Texas)","H-E-B Brand"],["pub","Publix","GreenWise"],
    ["spr","Sprouts","Sprouts Brand"],["alb","Albertsons","Signature Select"],
    ["saf","Safeway","Signature Select"],["frd","Fred Meyer","Kroger Brand"],
    ["win","WinCo Foods","WinCo Brand"],["wnd","Winn-Dixie","SE Grocers"],
    ["mij","Meijer","Meijer Brand"],["fl","Food Lion","Food Lion"],
    ["gnt","Giant Food","Giant Brand"],["wf","Whole Foods","365"],
  ]],
  ["es","España","🇪🇸","€","EUR",[
    ["me","Mercadona","Hacendado"],["li","Lidl","Lidl Brand"],
    ["ca","Carrefour","Carrefour"],["di","Dia","Dia"],
    ["al3","Alcampo","Auchan"],["er","Eroski","Eroski"],
    ["co2","Consum","Consum"],["hi","HiperCor","El Corte Inglés"],
  ]],
  ["co","Colombia","🇨🇴","$","COP",[
    ["ex","Éxito","Éxito"],["ju","Jumbo","Jumbo"],
    ["d1","D1","D1 Brand"],["ar","Ara","Ara"],
    ["olf","Olímpica","Génesis"],["pr","PriceSmart","PriceSmart"],
  ]],
  ["ar","Argentina","🇦🇷","$","ARS",[
    ["car","Carrefour","Carrefour"],["di2","Dia","Dia"],
    ["ct","Coto","Coto"],["jua","Jumbo","Jumbo"],
    ["dis","Disco","Disco"],
  ]],
  ["cl","Chile","🇨🇱","$","CLP",[
    ["juc","Jumbo","Jumbo"],["ld","Líder","Great Value"],
    ["tt","Tottus","Tottus"],["uni","Unimarc","Unimarc"],
    ["acu","Acuenta","Acuenta"],
  ]],
  ["uk","Reino Unido","🇬🇧","£","GBP",[
    ["te","Tesco","Tesco Own"],["sa","Sainsbury's","Basics"],
    ["as","ASDA","Smart Price"],["alu","ALDI","ALDI Brand"],
    ["lid","Lidl","Lidl Brand"],["mor","Morrisons","Morrisons"],
  ]],
  ["br","Brasil","🇧🇷","R$","BRL",[
    ["cbr","Carrefour","Carrefour"],["at","Atacadão","Atacadão"],
    ["ass","Assaí","Assaí"],["pau","Pão de Açúcar","Qualitá"],
  ]],
  ["pe","Perú","🇵🇪","S/","PEN",[
    ["pl","Plaza Vea","Bell's"],["ttt","Tottus","Tottus"],
    ["me2","Metro","Metro"],["mas","Mass","Mass"],
  ]],
];

const TAX = {
  mx:["IVA",0.16,false,[["Nacional",0.16],["Zona fronteriza norte (Sonora, BC, Chihuahua, Coahuila, NL, Tamaulipas)",0.08]]],
  us:["Sales Tax",0.085,true,[
    ["Alabama",0.04],["Alaska",0.00],["Arizona",0.056],["Arkansas",0.065],
    ["California",0.0725],["Colorado",0.029],["Connecticut",0.0635],["Delaware",0.00],
    ["Florida",0.06],["Georgia",0.04],["Hawaii",0.04],["Idaho",0.06],
    ["Illinois",0.0625],["Indiana",0.07],["Iowa",0.06],["Kansas",0.065],
    ["Kentucky",0.06],["Louisiana",0.0445],["Maine",0.055],["Maryland",0.06],
    ["Massachusetts",0.0625],["Michigan",0.06],["Minnesota",0.06875],["Mississippi",0.07],
    ["Missouri",0.04225],["Montana",0.00],["Nebraska",0.055],["Nevada",0.0685],
    ["New Hampshire",0.00],["New Jersey",0.06625],["New Mexico",0.05125],["New York",0.04],
    ["North Carolina",0.0475],["North Dakota",0.05],["Ohio",0.0575],["Oklahoma",0.045],
    ["Oregon",0.00],["Pennsylvania",0.06],["Rhode Island",0.07],["South Carolina",0.06],
    ["South Dakota",0.045],["Tennessee",0.07],["Texas",0.0625],["Utah",0.0485],
    ["Vermont",0.06],["Virginia",0.053],["Washington",0.065],["West Virginia",0.06],
    ["Wisconsin",0.05],["Wyoming",0.04],
  ]],
  es:["IVA",0.21,false,[["Estándar",0.21],["Reducido (alimentos)",0.10],["Superreducido (pan, leche)",0.04],["Canarias",0.07],["Ceuta y Melilla",0.00]]],
  co:["IVA",0.19,false,[["Nacional",0.19],["Alimentos básicos",0.00]]],
  ar:["IVA",0.21,false,[["Nacional",0.21],["Reducido (alimentos)",0.105],["Buenos Aires + provincial",0.24],["Tierra del Fuego",0.00]]],
  cl:["IVA",0.19,false,[["Nacional",0.19]]],
  uk:["VAT",0.20,false,[["Estándar",0.20],["Reducido",0.05],["Alimentos y medicamentos",0.00]]],
  br:["ICMS",0.17,false,[["São Paulo",0.18],["Rio de Janeiro",0.20],["Minas Gerais",0.18],["Bahia",0.19],["Rio Grande do Sul",0.17],["Otros estados",0.17]]],
  pe:["IGV",0.18,false,[["Nacional",0.18],["Zona franca (Tacna)",0.00]]],
};

const BASE = {mx:22,us:3,es:2.2,co:4500,ar:950,cl:1300,uk:1.8,br:7,pe:4};
const VD = [
  {l:"✓ Idéntico",c:"#16a34a",bg:"#dcfce7"},
  {l:"~ Similar", c:"#d97706",bg:"#fef3c7"},
  {l:"≠ Diferente",c:"#dc2626",bg:"#fee2e2"},
];
const NK = ["Calorías","Proteína","Carbos","Grasas","Azúcares","Sodio"];
const NU = ["kcal","g","g","g","g","mg"];
const ALL_CATS = ["Todos",...Object.keys(CC)];

function getPrice(pid, cid, gen) {
  const s = pid.split("").reduce((a,c) => a + c.charCodeAt(0), 0);
  const b = (BASE[cid]||22) * (1 + (s%8) * 0.28);
  return +(gen ? b*0.60 : b).toFixed(2);
}

// ── CALCULATOR COMPONENT ──────────────────────────────────────────────────────
let rid = 1;
function Calc({ country, cart }) {
  const cid = country[0], sym = country[3], cur = country[4];
  const tax = TAX[cid] || ["IVA",0.16,false,[["Nacional",0.16]]];
  const states = tax[3] || [];

  const [rows, setRows] = useState(
    cart.length > 0
      ? cart.map(i => ({ id: rid++, name: i.name, price: i.price.toFixed(2), qty: 1 }))
      : [{ id: rid++, name: "", price: "", qty: 1 }]
  );
  const [stateIdx, setStateIdx] = useState(0);
  const [taxVal, setTaxVal] = useState(
    states.length > 0 ? (states[0][1]*100).toFixed(1) : (tax[1]*100).toFixed(1)
  );
  const [tip, setTip] = useState(0);
  const [discVal, setDiscVal] = useState("");
  const [discType, setDiscType] = useState("pct");
  const [budget, setBudget] = useState("");

  const sub = rows.reduce((s,r) => s + (parseFloat(r.price)||0) * (parseInt(r.qty)||1), 0);
  const discAmt = discType === "pct" ? sub*(parseFloat(discVal)||0)/100 : parseFloat(discVal)||0;
  const afterDisc = Math.max(0, sub - discAmt);
  const taxAmt = afterDisc * (parseFloat(taxVal)||0) / 100;
  const tipAmt = afterDisc * tip / 100;
  const total = afterDisc + taxAmt + tipAmt;
  const budgetNum = parseFloat(budget)||0;
  const overBudget = budgetNum > 0 && total > budgetNum;
  const underBudget = budgetNum > 0 && total <= budgetNum;

  const addRow = () => setRows(r => [...r, { id: rid++, name:"", price:"", qty:1 }]);
  const removeRow = id => setRows(r => r.filter(x => x.id !== id));
  const updateRow = (id,k,v) => setRows(r => r.map(x => x.id===id ? {...x,[k]:v} : x));

  const onStateChange = (i) => {
    setStateIdx(i);
    setTaxVal((states[i][1]*100).toFixed(1));
  };

  const iS = { fontFamily:"inherit", background:"#f8fafc", border:"2px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:13, color:"#1e293b", outline:"none", width:"100%", transition:"border-color .2s" };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, alignItems:"start" }}>

      {/* LEFT — items */}
      <div style={{ background:"#fff", borderRadius:16, border:"2px solid #f1f5f9", padding:20 }}>
        <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>🛍️ Productos</div>
        <div style={{ fontSize:11, color:"#94a3b8", marginBottom:16 }}>Agrega los productos que piensas comprar</div>
        {cart.length > 0 && (
          <div style={{ background:"#f0fdf4", borderRadius:10, padding:"8px 12px", marginBottom:12, fontSize:11, color:"#16a34a", fontWeight:600 }}>
            ✓ Se importaron {cart.length} productos de tu lista
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {rows.map((row, idx) => (
            <div key={row.id} style={{ display:"grid", gridTemplateColumns:"1fr 90px 50px 30px", gap:7, alignItems:"center" }}>
              <input style={iS} placeholder={`Producto ${idx+1}`} value={row.name} onChange={e=>updateRow(row.id,"name",e.target.value)}/>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", fontSize:12, color:"#94a3b8" }}>{sym}</span>
                <input style={{...iS,paddingLeft:20,width:"100%"}} type="number" placeholder="0.00" value={row.price} onChange={e=>updateRow(row.id,"price",e.target.value)}/>
              </div>
              <input style={{...iS,textAlign:"center"}} type="number" min="1" value={row.qty} onChange={e=>updateRow(row.id,"qty",e.target.value)}/>
              <button onClick={()=>removeRow(row.id)} style={{ background:"#fef2f2", color:"#dc2626", border:"2px solid #fecaca", borderRadius:7, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <X size={13}/>
              </button>
            </div>
          ))}
        </div>
        <button onClick={addRow} style={{ width:"100%", background:"#f8fafc", border:"2px dashed #e2e8f0", borderRadius:10, padding:9, fontSize:12, color:"#94a3b8", cursor:"pointer", fontWeight:600, fontFamily:"inherit", marginTop:10, transition:"all .15s" }}
          onMouseOver={e=>{e.currentTarget.style.borderColor="#16a34a";e.currentTarget.style.color="#16a34a"}}
          onMouseOut={e=>{e.currentTarget.style.borderColor="#e2e8f0";e.currentTarget.style.color="#94a3b8"}}>
          + Agregar producto
        </button>
      </div>

      {/* RIGHT — config + summary */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

        {/* Config */}
        <div style={{ background:"#fff", borderRadius:16, border:"2px solid #f1f5f9", padding:20 }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>⚙️ Configuración</div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {states.length > 1 && (
              <div>
                <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginBottom:5 }}>Estado / Región</div>
                <select style={{...iS,cursor:"pointer"}} value={stateIdx} onChange={e=>onStateChange(parseInt(e.target.value))}>
                  {states.map(([name],i) => <option key={i} value={i}>{name}</option>)}
                </select>
              </div>
            )}

            <div>
              <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginBottom:5 }}>
                {tax[0]} <span style={{ color:"#94a3b8", fontWeight:400 }}>(puedes ajustarlo)</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <input type="number" style={{...iS,width:80}} value={taxVal} onChange={e=>setTaxVal(e.target.value)}/>
                <span style={{ fontSize:13, color:"#64748b", fontWeight:600 }}>%</span>
                <button onClick={()=>setTaxVal((states.length>0?states[stateIdx][1]:tax[1])*100)}
                  style={{ background:"#f1f5f9", border:"none", borderRadius:7, padding:"6px 12px", fontSize:11, color:"#64748b", cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
                  Restablecer
                </button>
              </div>
            </div>

            {tax[2] && (
              <div>
                <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginBottom:5 }}>Propina (tip)</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[0,10,15,18,20].map(t => (
                    <button key={t} onClick={()=>setTip(t)}
                      style={{ background:tip===t?"#16a34a":"#f8fafc", color:tip===t?"#fff":"#64748b", border:`2px solid ${tip===t?"#16a34a":"#f1f5f9"}`, borderRadius:8, padding:"5px 10px", fontSize:12, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
                      {t===0?"Sin propina":`${t}%`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginBottom:5 }}>Descuento o cupón</div>
              <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                <input type="number" style={{...iS,width:80}} placeholder="0" value={discVal} onChange={e=>setDiscVal(e.target.value)}/>
                <div style={{ display:"flex", gap:4 }}>
                  {[["pct","%"],["fixed",sym]].map(([v,l]) => (
                    <button key={v} onClick={()=>setDiscType(v)}
                      style={{ background:discType===v?"#f0fdf4":"#f8fafc", color:discType===v?"#16a34a":"#64748b", border:`2px solid ${discType===v?"#16a34a":"#f1f5f9"}`, borderRadius:7, padding:"5px 12px", fontSize:12, cursor:"pointer", fontWeight:700, fontFamily:"inherit" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginBottom:5 }}>Mi presupuesto (opcional)</div>
              <input type="number" style={iS} placeholder="¿Cuánto tienes para gastar?" value={budget} onChange={e=>setBudget(e.target.value)}/>
              {overBudget && <div style={{ background:"#fef2f2", borderRadius:8, padding:"6px 10px", marginTop:6, fontSize:11, color:"#dc2626", fontWeight:600 }}>⚠️ Te pasas por {sym}{(total-budgetNum).toFixed(2)}</div>}
              {underBudget && <div style={{ background:"#f0fdf4", borderRadius:8, padding:"6px 10px", marginTop:6, fontSize:11, color:"#16a34a", fontWeight:600 }}>✓ Te sobran {sym}{(budgetNum-total).toFixed(2)}</div>}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ background:"#fff", borderRadius:16, border:"2px solid #f1f5f9", padding:20 }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>📊 Resumen</div>
          {[
            ["Subtotal", sym+sub.toFixed(2), false],
            discAmt>0 ? [`Descuento`, `-${sym}${discAmt.toFixed(2)}`, false, "#16a34a"] : null,
            discAmt>0 ? ["Después del descuento", sym+afterDisc.toFixed(2), false] : null,
            [`${tax[0]} (${taxVal}%)`, sym+taxAmt.toFixed(2), false],
            tip>0 ? [`Propina (${tip}%)`, sym+tipAmt.toFixed(2), false] : null,
          ].filter(Boolean).map(([k,v,bold,vc],i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", fontSize:13 }}>
              <span style={{ color:vc||"#64748b" }}>{k}</span>
              <span style={{ fontWeight:600, color:vc||"#1e293b" }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop:"3px solid #f1f5f9", marginTop:8, paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:16, fontWeight:800 }}>Total</span>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:28, fontWeight:800, color:"#16a34a", letterSpacing:-.5 }}>{sym}{total.toFixed(2)}</div>
              <div style={{ fontSize:11, color:"#94a3b8" }}>{cur}</div>
            </div>
          </div>
          {budgetNum > 0 && (
            <div style={{ height:8, background:"#f1f5f9", borderRadius:4, overflow:"hidden", marginTop:10 }}>
              <div style={{ height:"100%", width:`${Math.min(total/budgetNum*100,100)}%`, background:overBudget?"#dc2626":"#16a34a", borderRadius:4, transition:"width .4s" }}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function MrShopper() {
  const [cid, setCid] = useState("mx");
  const [sid, setSid] = useState("wm");
  const [cat, setCat] = useState("Todos");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("comparar");
  const [openNut, setOpenNut] = useState(null);
  const [cart, setCart] = useState([]);

  const country = COUNTRIES.find(c=>c[0]===cid) || COUNTRIES[0];
  const store = country[5].find(s=>s[0]===sid) || country[5][0];
  const sym = country[3];

  const filtered = useMemo(() =>
    PRODUCTS.filter(p => (cat==="Todos"||p[1]===cat) && p[2].toLowerCase().includes(q.toLowerCase()))
  , [cat, q]);

  const addCart = (p, gen) => {
    const price = getPrice(p[0],cid,gen), bp = getPrice(p[0],cid,false);
    setCart(prev => {
      const ex = prev.findIndex(i=>i.id===p[0]);
      if(ex>=0) return prev.map(i=>i.id===p[0]?{...i,gen,price,bp}:i);
      return [...prev, { id:p[0], cat:p[1], name:p[2], brand:p[3], gen, price, bp }];
    });
  };

  const removeCart = id => setCart(prev => prev.filter(i=>i.id!==id));

  const totals = useMemo(() => {
    const t = cart.reduce((s,i)=>s+i.price,0);
    const tb = cart.reduce((s,i)=>s+i.bp,0);
    return { t, tb, saved:tb-t, pct:tb>0?(tb-t)/tb*100:0 };
  }, [cart]);

  const btn = (label,active,onClick,color,bg) => (
    <button onClick={onClick} style={{ border:`2px solid ${active?color:"#e2e8f0"}`, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", color:active?"#fff":color, background:active?color:bg||"#fff", whiteSpace:"nowrap", transition:"all .15s", fontFamily:"inherit" }}>
      {label}
    </button>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#1e293b" }}>

      {/* DISCLAIMER */}
      <div style={{ background:"#fefce8", borderBottom:"2px solid #fde68a", padding:"10px 20px", display:"flex", alignItems:"flex-start", gap:8 }}>
        <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
        <p style={{ fontSize:11, color:"#92400e", lineHeight:1.6 }}>
          <strong>Aviso legal:</strong> Mr. Shopper es una herramienta de comparación independiente. Todas las marcas mencionadas son propiedad de sus respectivos dueños. No existe afiliación, patrocinio ni relación comercial con ninguna marca o tienda. Los precios son estimados de referencia y pueden variar.
        </p>
      </div>

      {/* HEADER */}
      <div style={{ background:"#fff", borderBottom:"2px solid #f1f5f9", position:"sticky", top:0, zIndex:50, boxShadow:"0 1px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:1060, margin:"0 auto", padding:"0 18px" }}>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, paddingBottom:10, flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#16a34a,#15803d)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(22,163,74,0.3)" }}>
                <ShoppingCart size={22} color="#fff" strokeWidth={2}/>
              </div>
              <div>
                <div style={{ fontSize:20, fontWeight:800, letterSpacing:-.5 }}>Mr. Shopper</div>
                <div style={{ fontSize:10, color:"#94a3b8", letterSpacing:.5 }}>COMPARA · AHORRA · DECIDE MEJOR</div>
              </div>
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              <select style={{ background:"#fff", border:"2px solid #e2e8f0", borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:500, color:"#1e293b", outline:"none", cursor:"pointer", fontFamily:"inherit" }}
                value={cid} onChange={e=>{setCid(e.target.value);setSid(COUNTRIES.find(c=>c[0]===e.target.value)[5][0][0]);}}>
                {COUNTRIES.map(c=><option key={c[0]} value={c[0]}>{c[2]} {c[1]}</option>)}
              </select>
              <select style={{ background:"#fff", border:"2px solid #e2e8f0", borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:500, color:"#1e293b", outline:"none", cursor:"pointer", fontFamily:"inherit" }}
                value={sid} onChange={e=>setSid(e.target.value)}>
                {country[5].map(s=><option key={s[0]} value={s[0]}>{s[1]}</option>)}
              </select>
              <a href="https://ko-fi.com/silvertounge" target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:6, background:"#ff5e5b", color:"#fff", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:700, textDecoration:"none" }}>
                ☕ Ko-fi
              </a>
              <a href="https://buymeacoffee.com/silvertounge" target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:6, background:"#ffdd00", color:"#000", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:700, textDecoration:"none" }}>
                ☕ Buy Me a Coffee
              </a>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"2px solid #f1f5f9" }}>
            <div style={{ display:"flex" }}>
              {[["comparar","🛒 Comparar"],["lista",`Mi lista${cart.length>0?` (${cart.length})`:""}`],["calculadora","Calculadora"]].map(([id,label]) => (
                <button key={id} onClick={()=>setTab(id)}
                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, padding:"12px 18px", color:tab===id?"#1e293b":"#94a3b8", position:"relative", fontFamily:"inherit", transition:"color .2s" }}>
                  {label}
                  {tab===id && <div style={{ position:"absolute", bottom:0, left:18, right:18, height:3, background:"#16a34a", borderRadius:"2px 2px 0 0" }}/>}
                </button>
              ))}
            </div>
            {tab==="comparar" && (
              <div style={{ position:"relative" }}>
                <Search size={14} color="#94a3b8" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}/>
                <input style={{ background:"#fff", border:"2px solid #e2e8f0", borderRadius:10, padding:"9px 14px 9px 32px", fontSize:13, color:"#1e293b", outline:"none", width:200, fontFamily:"inherit" }}
                  placeholder="Buscar producto..." value={q} onChange={e=>setQ(e.target.value)}/>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth:1060, margin:"0 auto", padding:"20px 18px 40px" }}>

        {/* COMPARAR */}
        {tab==="comparar" && (
          <div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:18 }}>
              {ALL_CATS.map(c => {
                const cfg = CC[c];
                const on = cat===c;
                return (
                  <button key={c} onClick={()=>setCat(c)}
                    style={{ border:`2px solid ${on&&cfg?cfg.c:"#e2e8f0"}`, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", color:on&&cfg?"#fff":cfg?cfg.c:"#64748b", background:on&&cfg?cfg.c:cfg?cfg.bg:"#fff", whiteSpace:"nowrap", fontFamily:"inherit", transition:"all .15s" }}>
                    {cfg?cfg.i+" ":""}{c}
                  </button>
                );
              })}
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, padding:"10px 16px", background:"#fff", borderRadius:10, border:"2px solid #f1f5f9", width:"fit-content", fontSize:12, flexWrap:"wrap" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#16a34a" }}/>
              <strong>{store[1]}</strong>
              <span style={{ color:"#94a3b8" }}>·</span>
              <span style={{ color:"#64748b" }}>Genérico: <strong style={{ color:"#16a34a" }}>{store[2]}</strong></span>
              <span style={{ color:"#cbd5e1", marginLeft:8 }}>{filtered.length} productos</span>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:14 }}>
              {filtered.map(p => {
                const [id,pcat,name,brand,verd,note,nb,ng] = p;
                const cfg = CC[pcat] || DC;
                const vd = VD[verd];
                const bp = getPrice(id,cid,false), gp = getPrice(id,cid,true);
                const sav = (bp-gp).toFixed(2), savP = Math.round((bp-gp)/bp*100);
                const inCart = cart.find(i=>i.id===id);
                const isOpen = openNut===id;

                return (
                  <div key={id} style={{ background:"#fff", borderRadius:16, border:`2px solid ${inCart?"#86efac":"#f1f5f9"}`, transition:"all .2s", overflow:"hidden" }}
                    onMouseOver={e=>e.currentTarget.style.borderColor="#86efac"}
                    onMouseOut={e=>e.currentTarget.style.borderColor=inCart?"#86efac":"#f1f5f9"}>
                    <div style={{ height:5, background:cfg.c }}/>
                    <div style={{ padding:"14px 14px 12px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                          <div style={{ width:44, height:44, borderRadius:12, background:cfg.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{cfg.i}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, lineHeight:1.3 }}>{name}</div>
                            <div style={{ fontSize:11, color:"#94a3b8", marginTop:1 }}>{brand}</div>
                          </div>
                        </div>
                        <span style={{ background:vd.bg, color:vd.c, borderRadius:6, padding:"3px 8px", fontSize:10, fontWeight:700, flexShrink:0 }}>{vd.l}</span>
                      </div>

                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                        <div style={{ background:"#f8fafc", borderRadius:10, padding:"10px 12px", border:"2px solid #f1f5f9" }}>
                          <div style={{ fontSize:9, color:"#94a3b8", fontWeight:600, letterSpacing:1, marginBottom:2 }}>MARCA</div>
                          <div style={{ fontSize:20, fontWeight:800, color:"#64748b" }}>{sym}{bp}</div>
                          <div style={{ fontSize:9, color:"#cbd5e1", marginTop:1 }}>{brand.split("/")[0]}</div>
                        </div>
                        <div style={{ background:cfg.bg, borderRadius:10, padding:"10px 12px", border:`2px solid ${cfg.c}33` }}>
                          <div style={{ fontSize:9, color:cfg.c, fontWeight:700, letterSpacing:1, marginBottom:2 }}>GENÉRICO</div>
                          <div style={{ fontSize:20, fontWeight:800, color:cfg.c }}>{sym}{gp}</div>
                          <div style={{ fontSize:9, color:`${cfg.c}99`, marginTop:1 }}>{store[2]}</div>
                        </div>
                      </div>

                      <div style={{ background:"#f0fdf4", borderRadius:8, padding:"6px 10px", marginBottom:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:11, color:"#16a34a", fontWeight:700 }}>💰 Ahorras {sym}{sav}</span>
                        <span style={{ background:"#dcfce7", borderRadius:20, padding:"1px 8px", fontSize:11, color:"#16a34a", fontWeight:700 }}>{savP}% menos</span>
                      </div>

                      <p style={{ fontSize:11, color:"#64748b", lineHeight:1.6, marginBottom:10 }}>{note}</p>

                      {nb && ng && (
                        <div style={{ marginBottom:10 }}>
                          <button onClick={()=>setOpenNut(isOpen?null:id)}
                            style={{ width:"100%", background:"#f8fafc", border:"2px solid #f1f5f9", borderRadius:8, padding:"7px 10px", fontSize:11, color:"#64748b", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", fontWeight:600, fontFamily:"inherit" }}>
                            <span>📊 Ver tabla nutricional</span>
                            <ChevronDown size={14} color="#94a3b8" style={{ transform:isOpen?"rotate(180deg)":"none", transition:"transform .2s" }}/>
                          </button>
                          {isOpen && (
                            <div style={{ background:"#f8fafc", borderRadius:"0 0 8px 8px", padding:"10px 12px", border:"2px solid #f1f5f9", borderTop:"none" }}>
                              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
                                <thead>
                                  <tr>
                                    <th style={{ textAlign:"left", color:"#94a3b8", fontWeight:600, paddingBottom:5, fontSize:10 }}>Nutriente</th>
                                    <th style={{ textAlign:"center", color:"#64748b", fontWeight:700, paddingBottom:5, fontSize:10 }}>Marca</th>
                                    <th style={{ textAlign:"center", color:cfg.c, fontWeight:700, paddingBottom:5, fontSize:10 }}>Genérico</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {NK.map((k,i) => {
                                    const bv=nb[i],gv=ng[i],d=gv-bv;
                                    return (
                                      <tr key={k} style={{ borderTop:"1px solid #f1f5f9" }}>
                                        <td style={{ padding:"4px 0", color:"#64748b" }}>{k}</td>
                                        <td style={{ padding:"4px 0", textAlign:"center", color:"#64748b" }}>{bv}{NU[i]}</td>
                                        <td style={{ padding:"4px 0", textAlign:"center", color:d===0?"#16a34a":Math.abs(d)<5?"#d97706":"#dc2626" }}>
                                          {gv}{NU[i]}
                                          {d!==0 && <span style={{ fontSize:9, color:d>0?"#dc2626":"#16a34a", marginLeft:2 }}>{d>0?"+":""}{d}</span>}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ display:"flex", gap:7 }}>
                        <button onClick={()=>addCart(p,true)}
                          style={{ flex:1, background:cfg.c, color:"#fff", border:`2px solid ${cfg.c}`, borderRadius:10, padding:"9px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                          + Genérico
                        </button>
                        <button onClick={()=>addCart(p,false)}
                          style={{ flex:1, background:"#f8fafc", color:"#64748b", border:"2px solid #e2e8f0", borderRadius:10, padding:"9px 14px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                          + Marca
                        </button>
                        {inCart && (
                          <button onClick={()=>removeCart(id)}
                            style={{ background:"#fef2f2", color:"#dc2626", border:"2px solid #fecaca", borderRadius:10, padding:"9px 10px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <X size={13}/>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MI LISTA */}
        {tab==="lista" && (
          <div>
            {cart.length === 0 ? (
              <div style={{ textAlign:"center", padding:"70px 0" }}>
                <div style={{ width:80, height:80, borderRadius:24, background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:36 }}>🛒</div>
                <div style={{ fontSize:17, color:"#475569", fontWeight:700 }}>Tu lista está vacía</div>
                <div style={{ fontSize:13, color:"#94a3b8", marginTop:6 }}>Agrega productos desde la pestaña Comparar</div>
              </div>
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
                  {[
                    {l:"Tu lista", v:`${sym}${totals.t.toFixed(2)}`, s:country[4], c:"#1e293b", bg:"#fff", bo:"#f1f5f9"},
                    {l:"Si fuera todo marca", v:`${sym}${totals.tb.toFixed(2)}`, s:country[4], c:"#64748b", bg:"#f8fafc", bo:"#f1f5f9"},
                    {l:"💰 Total ahorrado", v:`${sym}${totals.saved.toFixed(2)}`, s:`${totals.pct.toFixed(0)}% menos`, c:"#16a34a", bg:"#f0fdf4", bo:"#86efac"},
                  ].map(x => (
                    <div key={x.l} style={{ background:x.bg, borderRadius:14, border:`2px solid ${x.bo}`, padding:"16px 18px" }}>
                      <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:5 }}>{x.l}</div>
                      <div style={{ fontSize:24, fontWeight:800, color:x.c, letterSpacing:-.5 }}>{x.v}</div>
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>{x.s}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {cart.map(item => {
                    const cfg = CC[item.cat] || DC;
                    return (
                      <div key={item.id} style={{ background:"#fff", borderRadius:12, border:"2px solid #f1f5f9", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, flexWrap:"wrap" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:40, height:40, borderRadius:10, background:cfg.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{cfg.i}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700 }}>{item.name}</div>
                            <div style={{ fontSize:11, marginTop:1, fontWeight:600, color:item.gen?"#16a34a":"#94a3b8" }}>
                              {item.gen ? `✓ ${store[2]}` : item.brand}
                            </div>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:18, fontWeight:800, color:item.gen?"#16a34a":"#64748b" }}>{sym}{item.price.toFixed(2)}</div>
                            {item.gen && <div style={{ fontSize:11, color:"#16a34a", fontWeight:600 }}>Ahorras {sym}{(item.bp-item.price).toFixed(2)}</div>}
                          </div>
                          <button onClick={()=>removeCart(item.id)}
                            style={{ background:"#fef2f2", color:"#dc2626", border:"2px solid #fecaca", borderRadius:8, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <X size={14}/>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* CALCULADORA */}
        {tab==="calculadora" && <Calc country={country} cart={cart}/>}

      </div>

      {/* FOOTER */}
      <div style={{ borderTop:"2px solid #f1f5f9", background:"#fff", padding:"20px 18px" }}>
        <div style={{ maxWidth:1060, margin:"0 auto", display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)", border:"2px solid #bbf7d0", borderRadius:14, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#15803d" }}>☕ ¿Te fue útil Mr. Shopper?</div>
              <div style={{ fontSize:12, color:"#16a34a", marginTop:2 }}>Si te ayudó a ahorrar, considera invitarme un café. Siempre es gratis usar la herramienta.</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <a href="https://ko-fi.com/silvertounge" target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:6, background:"#ff5e5b", color:"#fff", borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:700, textDecoration:"none" }}>
                ☕ Ko-fi
              </a>
              <a href="https://buymeacoffee.com/silvertounge" target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:6, background:"#ffdd00", color:"#000", borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:700, textDecoration:"none" }}>
                ☕ Buy Me a Coffee
              </a>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
            <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
            <p style={{ fontSize:11, color:"#94a3b8", lineHeight:1.7 }}>
              <strong style={{ color:"#64748b" }}>Aviso legal:</strong> Mr. Shopper es una herramienta de comparación independiente. Todas las marcas mencionadas son propiedad de sus respectivos dueños. No existe afiliación, patrocinio ni relación comercial con ninguna marca o tienda. Los precios son estimados de referencia y pueden variar. Verifica siempre las etiquetas del producto real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
