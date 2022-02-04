"use strict";

var fs = require("fs");

var PDFDocument = require("pdfkit");

var fetch = require("node-fetch");

var _require = require('../../Utils/constants'),
    constants = _require.constants;

function createInvoice(invoice, path) {
  var fontName, fontPath;
  return regeneratorRuntime.async(function createInvoice$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          fontkit = require("fontkit");
          fontName = "CerebriSans-Regular";
          fontPath = constants.HOST + "assets/fonts/CerebriSans-Regular.ttf";
          console.log(fontPath);
          fetch(fontPath).then(function (res) {
            return res.arrayBuffer();
          }).then(function (fontBlob) {
            console.log("inseid");
            var customFont = fontkit.create(new Buffer.from(fontBlob)).stream.buffer;
            var doc = new PDFDocument({
              size: "A4",
              margin: 50
            });
            doc.registerFont(fontName, customFont);
            doc.font(fontName);
            generateHeader(doc, invoice);
            generateCustomerInformation(doc, invoice);
            generateInvoiceTable(doc, invoice);
            doc.end();
            doc.pipe(fs.createWriteStream(path));
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function generateHeader(doc, invoice) {
  // const path = invoice.logo
  // fs.access(path, fs.F_OK, (err) => {
  //   if (err) {
  //     doc
  //     .fillColor("#444444")
  //     .fontSize(20)
  //     .text(invoice.establishment, 110, 55)
  //     .fontSize(12.5)
  //     .text(invoice.branch, 110, 80)
  //     .fontSize(10)
  //     .text(invoice.company_email, 200, 50, { align: "right" })
  //     .text(invoice.address, 200, 65, { align: "right" })
  //     .moveDown();
  //   }
  //   else{
  //   }
  // })
  doc.fillColor("#444444").fontSize(20).text(invoice.establishment, 50, 55).fontSize(12.5).text(invoice.branch, 50, 80).fontSize(10).text(invoice.company_email, 200, 50, {
    align: "right"
  }).text(invoice.address, 200, 65, {
    align: "right"
  }).moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("RECIEPT", 50, 160);
  generateHr(doc, 185);
  var customerInformationTop = 200;
  doc.fontSize(10).text("ORDER-ID", 50, customerInformationTop).text(invoice.order_ref, 150, customerInformationTop).text("DATE", 50, customerInformationTop + 17).text(invoice.date, 150, customerInformationTop + 17).text("STATUS", 50, customerInformationTop + 35).text(invoice.status, 150, customerInformationTop + 35).text("Ordered By", 300, customerInformationTop).text(invoice.client.email, 400, customerInformationTop).text("Recieved By", 300, customerInformationTop + 17).text(invoice.received_by, 400, customerInformationTop + 17).moveDown();
  generateHr(doc, 256);
}

var endPosition = 0;
var subtotalPosition = 0;

function generateInvoiceTable(doc, invoice) {
  var i;
  var invoiceTableTop = 330;
  generateTableRow(doc, invoiceTableTop, "Item", "", "", "", "Quantity");
  generateHr(doc, invoiceTableTop + 20);
  var total_qty = 0;
  var position = 0;
  var thrasholdRow = 0;
  var another = 0;
  var y = invoiceTableTop;

  for (i = 0; i < invoice.items.length; i++) {
    var item = invoice.items[i];
    console.log(y + (i + 1) * 30, "actual");

    if (y + (i + 1) * 30 <= 780) {
      position = y + (i + 1) * 30;

      if (y + (i + 1) * 30 == 780) {
        thrasholdRow = i;
        console.log("threshold ==", thrasholdRow);
      }
    } else {
      console.log("differnce", i - thrasholdRow);

      if (i - thrasholdRow == 1) {
        position = 50 + (i - thrasholdRow) * 30;
        another = position - 30;
      } else {
        position = another + (i - thrasholdRow) * 30;
      }
    }

    total_qty += Number(item.qty);
    generateTableRow(doc, position, item.refernce + " - " + item.inventory_name, "", "", "", item.qty);
    generateHr(doc, position == 780 ? 70 : position + 20);
    subtotalPosition = position == 780 ? 90 : position + 40;
  }

  if (invoice.items.length == 14) {
    // generateTableRow(
    //   doc,
    //   780 + 40,
    //   "TOTAL QUANTITY",
    //   "",
    //   "",
    //   "",
    //   total_qty
    // );
    console.log("inside successsss");
    subtotalPosition = position + 1 * 30;
    doc.fontSize(10).text("TOTAL QUANTITY", 50, subtotalPosition).text("", 150, subtotalPosition == 780 ? 50 : subtotalPosition).text("", 280, subtotalPosition == 780 ? 50 : subtotalPosition, {
      width: 90,
      align: "right"
    }).text("", 370, subtotalPosition == 780 ? 50 : subtotalPosition, {
      width: 90,
      align: "right"
    }).text(total_qty, 0, subtotalPosition == 780 ? 50 : subtotalPosition, {
      align: "right"
    });
  } else {
    generateTableRow(doc, subtotalPosition, "TOTAL QUANTITY", "", "", "", total_qty);
  }

  console.log(subtotalPosition);
  generateFooter(doc, subtotalPosition == 780 ? 70 : subtotalPosition, invoice);
}

function generateFooter(doc) {
  var subtotalPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var invoice = arguments.length > 2 ? arguments[2] : undefined;
  doc.fontSize(12).text("BARISTA MESSAGE", 50, subtotalPosition + 20).fontSize(10).text(invoice.user_message != "" ? invoice.user_message : "No Comments", 50, subtotalPosition + 20 == 780 ? 70 : subtotalPosition + 40).fontSize(12).text("", 50, subtotalPosition + 20 == 780 ? 90 : subtotalPosition + 60).fontSize(10).text("Recuerda marcar este pedido como entregado en Sharafa cuando lo recibas ! Verifica todas los productos y cantidades, y si algo difiere con el albaràn ponte en contacto con la persona responsable en HQ.", 50, subtotalPosition + 20 == 780 ? 110 : subtotalPosition + 80);
}

function generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
  doc.fontSize(10).text(item, 50, y).text(description, 150, y == 780 ? 50 : y).text(unitCost, 280, y == 780 ? 50 : y, {
    width: 90,
    align: "right"
  }).text(quantity, 370, y == 780 ? 50 : y, {
    width: 90,
    align: "right"
  }).text(lineTotal, 0, y == 780 ? 50 : y, {
    align: "right"
  });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "€ " + Number(cents).toFixed(2);
}

module.exports = {
  createInvoice: createInvoice
};