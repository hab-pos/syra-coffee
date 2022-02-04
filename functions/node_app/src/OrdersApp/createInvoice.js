const fs = require("fs");
const PDFDocument = require("pdfkit");

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  generateHeader(doc,invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  // generateFooter(doc,invoice);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc,invoice) {
doc
.image(invoice.logo, 39 , 37, { width: 60 })
.fontSize(20)
.font('./assets/fonts/CerebriSans-Bold.ttf')
.text(invoice.establishment, 95, 50)
.fontSize(13)
.fillColor("#444444")
.font('./assets/fonts/CerebriSans-Regular.ttf')
.text(invoice.branch, 95, 73)
.fillColor("#000000")
.fontSize(12)
.font('./assets/fonts/CerebriSans-Bold.ttf')
.text("From", 365, 36, { align: "left" })
.font('./assets/fonts/CerebriSans-Regular.ttf')
.fontSize(10.2)
.fillColor("#444444")
.text(invoice.company_name, 365, 50, { align: "left" })
.text(invoice.address + " 08012, Barcelona", 365, 64, { align: "left" })
.text(invoice.nif, 365, 92, { align: "left" })
.text("facturas@syra.coffee", 365, 106, { align: "left" })
.fillColor("#000000")
.moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fontSize(20.5)
    .font('./assets/fonts/CerebriSans-Bold.ttf')
    .text("RECIBO", 50, 147);

  generateHr(doc, 172);

  const customerInformationTop = 188;

  doc
    .fontSize(10)
    .text("ORDER ID", 50, customerInformationTop)
    .font('./assets/fonts/CerebriSans-Regular.ttf')
    .text(invoice.order_ref, 150, customerInformationTop)
    .font('./assets/fonts/CerebriSans-Bold.ttf')
    .text("DATE", 50, customerInformationTop + 17)
    .font('./assets/fonts/CerebriSans-Regular.ttf')
    .text(invoice.date, 150, customerInformationTop + 17)
    .font('./assets/fonts/CerebriSans-Bold.ttf')
    .text("TOTAL AMOUNT", 50, customerInformationTop + 35)
    .font('./assets/fonts/CerebriSans-Regular.ttf')
    .text(
      formatCurrency(invoice.subtotal - invoice.discount),
      150,
      customerInformationTop + 35
    )
    .font('./assets/fonts/CerebriSans-Bold.ttf')
    .text("EMAIL ID", 400, customerInformationTop)
    .font('./assets/fonts/CerebriSans-Regular.ttf')
    .text(invoice.client.email, 400, customerInformationTop + 17)
    .moveDown();

  generateHr(doc, 256);
}

var endPosition = 0;

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  let totTaxAmt = []
  let cummulative_amt_with_tax = 0
  let taxStrArr = []
  let totDiscount = 0
  generateTableRowHeader(
    doc,
    invoiceTableTop,
    "Item",
    "",
    "Precio",
    "Unidades",
    "Total",
    "Subtotal",
    "IVA"
  );
  generateHr(doc, invoiceTableTop + 20);

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    cummulative_amt_with_tax += (Number(item.price) - (Number(item.price) * Number(item.iva_percent) / (100 + Number(item.iva_percent)))) * Number(item.quantity)
    let indexTax = taxStrArr.indexOf(item.iva_percent + "%")
    if(indexTax < 0){
      taxStrArr.push(item.iva_percent + "%")
      totTaxAmt.push((Number(item.price) * Number(item.iva_percent) / (100 + Number(item.iva_percent))))
    }
    else{
      totTaxAmt[indexTax] += (Number(item.price) * Number(item.iva_percent) / (100 + Number(item.iva_percent)))
    }
    if(item.have_discount == 1){
      if(item.discount_type == "percent")
      {
        totDiscount += Number(item.price) * Number(item.discount_price) / 100
      }
      else{
        totDiscount += Number(item.discount_price)
      }
    }
    else{
      totDiscount += 0.00
    }
        
    generateTableRow(
      doc,
      position,
      item.product_name,
      "",
      formatCurrency(Number(item.price) - (Number(item.price) * Number(item.iva_percent) / (100 + Number(item.iva_percent)))),
      item.quantity,
      formatCurrency(Number(item.price) * Number(item.quantity)),
      formatCurrency((Number(item.price) - (Number(item.price) * Number(item.iva_percent) / (100 + Number(item.iva_percent)))) * Number(item.quantity)),
      item.iva_percent + "%"
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRowFooter(
    doc,
    subtotalPosition,
    "",
    "",
    "Base Imponible",
    "",
    formatCurrency(cummulative_amt_with_tax),
    "",
    ""
  );

  const paidToDatePosition = subtotalPosition

  for (i = 0; i < taxStrArr.length; i++) {
    const item = taxStrArr[i];
    const position = paidToDatePosition + (i + 1) * 20;
        
    generateTableRowFooter(
      doc,
      position,
      "",
      "",
      "IVA " + item,
      "",
      formatCurrency(totTaxAmt[i])
    );
  }
  
  const duePosition = paidToDatePosition + (i + 1) * 20;
  
  generateTableRowFooter(
    doc,
    duePosition,
    "",
    "",
    "Discount",
    "",
    formatCurrency(totDiscount)
  );

  const paidToDiscountPosition = duePosition + 25;

  generateTableRowHeader(
    doc,
    paidToDiscountPosition,
    "",
    "",
    "Total",
    "",
    formatCurrency(invoice.subtotal - invoice.discount)
  );
  generateFooter(doc, paidToDiscountPosition,invoice)
}
function generateFooter(doc, paidToDiscountPosition,invoice) {
    doc.font('./assets/fonts/CerebriSans-Regular.ttf').fontSize(10)
      .text(
        invoice.admin_message,
        50,
        paidToDiscountPosition + 260,
        { align: "center", width: 500 }
      );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal,
  add1,
  add2

) {
  doc
    .fontSize(10)
    .font('./assets/fonts/CerebriSans-Bold.ttf')
    .text(item, 50, y)
    .font('./assets/fonts/CerebriSans-Regular.ttf')
    .text(description, 55, y)
    .text(unitCost, 175, y, { width: 90, align: "right" })
    .text(quantity, 250, y, { width: 90, align: "right" })
    .text(add1, 315, y, { width: 90, align: "right" })
    .text(add2, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}


function generateTableRowFooter(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal,
  add1,
  add2

) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 55, y)
    .font('./assets/fonts/CerebriSans-Bold.ttf')
    .text(unitCost, 175, y, { width: 90, align: "right" })
    .font('./assets/fonts/CerebriSans-Regular.ttf')

    .text(quantity, 250, y, { width: 90, align: "right" })
    .text(add1, 315, y, { width: 90, align: "right" })
    .text(add2, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}


function generateTableRowHeader(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal,
  add1,
  add2

) {
  doc
    .fontSize(11)
    .font('./assets/fonts/CerebriSans-Bold.ttf')
    .text(item, 50, y)
    .text(description, 55, y)
    .text(unitCost, 175, y, { width: 90, align: "right" })
    .text(quantity, 250, y, { width: 90, align: "right" })
    .text(add1, 315, y, { width: 90, align: "right" })
    .text(add2, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}


function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "€ " + Number(cents).toFixed(2);
}



module.exports = {
  createInvoice
};
