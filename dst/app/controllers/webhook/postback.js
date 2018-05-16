"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * LINE webhook postbackコントローラー
 */
const kwskfsapi = require("@motionpicture/kwskfs-api-nodejs-client");
const pecorinoapi = require("@motionpicture/pecorino-api-nodejs-client");
const createDebug = require("debug");
// import { google } from 'googleapis';
const moment = require("moment");
const request = require("request-promise-native");
// tslint:disable-next-line:no-require-imports no-var-requires
require('moment-timezone');
const LINE = require("../../../line");
const debug = createDebug('kwskfs-line-ticket:controller:webhook:postback');
// const MESSAGE_TRANSACTION_NOT_FOUND = '該当取引はありません';
// const customsearch = google.customsearch('v1');
const PECORINO_API_ENDPOINT = process.env.PECORINO_API_ENDPOINT;
const PECORINO_CLIENT_ID = process.env.PECORINO_CLIENT_ID;
const PECORINO_CLIENT_SECRET = process.env.PECORINO_CLIENT_SECRET;
const PECORINO_AUTHORIZE_SERVER_DOMAIN = process.env.PECORINO_AUTHORIZE_SERVER_DOMAIN;
/**
 * 購入番号で取引を検索する
 * @export
 * @memberof app.controllers.webhook.postback
 */
function searchTransactionByPaymentNo(userId, paymentNo, performanceDate) {
    return __awaiter(this, void 0, void 0, function* () {
        yield LINE.pushMessage(userId, `${performanceDate}-${paymentNo}の取引を検索しています...`);
        yield LINE.pushMessage(userId, 'implementing...');
    });
}
exports.searchTransactionByPaymentNo = searchTransactionByPaymentNo;
// export async function choosePaymentMethod(user: User, paymentMethod: PaymentMethodType, transactionId: string, friendPayPrice: number) {
//     const personService = new kwskfsapi.service.Person({
//         endpoint: <string>process.env.API_ENDPOINT,
//         auth: user.authClient
//     });
//     const placeOrderService = new kwskfsapi.service.transaction.PlaceOrder({
//         endpoint: <string>process.env.API_ENDPOINT,
//         auth: user.authClient
//     });
//     let price: number;
//     if (paymentMethod === 'Pecorino') {
//         debug('checking balance...', paymentMethod, transactionId);
//         await LINE.pushMessage(user.userId, '残高を確認しています...');
//         const actionRepo = new kwskfs.repository.Action(kwskfs.mongoose.connection);
//         let seatReservations = await actionRepo.findAuthorizeByTransactionId(transactionId);
//         seatReservations = seatReservations
//             .filter((a) => a.actionStatus === kwskfsapi.factory.actionStatusType.CompletedActionStatus)
//             .filter((a) => a.object.typeOf === kwskfsapi.factory.action.authorize.seatReservation.ObjectType.SeatReservation);
//         price = seatReservations[0].result.price;
//         const pecorinoAuthorization = await placeOrderService.createPecorinoAuthorization({
//             transactionId: transactionId,
//             price: price
//         });
//         debug('Pecorino残高確認済', pecorinoAuthorization);
//         await LINE.pushMessage(user.userId, '残高の確認がとれました。');
//     } else if (paymentMethod === 'FriendPay') {
//         price = friendPayPrice;
//     } else {
//         throw new Error(`Unknown payment method ${paymentMethod}`);
//     }
//     const contact = await personService.getContacts({ personId: 'me' });
//     await placeOrderService.setCustomerContact({
//         transactionId: transactionId,
//         contact: contact
//     });
//     debug('customer contact set.');
//     await LINE.pushMessage(user.userId, `以下の通り注文を受け付けようとしています...
// ------------
// 購入者情報
// ------------
// ${contact.givenName} ${contact.familyName}
// ${contact.email}
// ${contact.telephone}
// ------------
// 決済方法
// ------------
// ${paymentMethod}
// ${price} JPY
// `);
//     // 注文内容確認
//     await request.post({
//         simple: false,
//         url: 'https://api.line.me/v2/bot/message/push',
//         auth: { bearer: process.env.LINE_BOT_CHANNEL_ACCESS_TOKEN },
//         json: true,
//         body: {
//             to: user.userId,
//             messages: [
//                 {
//                     type: 'template',
//                     altText: 'This is a buttons template',
//                     template: {
//                         type: 'confirm',
//                         text: '注文を確定しますか？',
//                         actions: [
//                             {
//                                 type: 'postback',
//                                 label: 'Yes',
//                                 data: `action=confirmOrder&transactionId=${transactionId}`
//                             },
//                             {
//                                 type: 'postback',
//                                 label: 'No',
//                                 data: `action=cancelOrder&transactionId=${transactionId}`
//                             }
//                         ]
//                     }
//                 }
//             ]
//         }
//     }).promise();
// }
// export async function confirmOrder(user: User, transactionId: string) {
//     await LINE.pushMessage(user.userId, '注文を確定しています...');
//     const placeOrderService = new kwskfsapi.service.transaction.PlaceOrder({
//         endpoint: <string>process.env.API_ENDPOINT,
//         auth: user.authClient
//     });
//     const order = await placeOrderService.confirm({
//         transactionId: transactionId
//     });
//     const event = order.acceptedOffers[0].itemOffered.reservationFor;
//     const reservedTickets = order.acceptedOffers.map(
//         // tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
//         (orderItem) => `${orderItem.itemOffered.reservedTicket.ticketedSeat.seatNumber} ${orderItem.itemOffered.reservedTicket.coaTicketInfo.ticketName} ￥${orderItem.itemOffered.reservedTicket.coaTicketInfo.salePrice}`
//     ).join('\n');
//     const orderDetails = `--------------------
// 注文内容
// --------------------
// 予約番号: ${order.confirmationNumber}
// --------------------
// 購入者情報
// --------------------
// ${order.customer.name}
// ${order.customer.telephone}
// ${order.customer.email}
// ${(order.customer.memberOf !== undefined) ? `${order.customer.memberOf.membershipNumber}` : ''}
// --------------------
// 座席予約
// --------------------
// ${order.acceptedOffers[0].itemOffered.reservationFor.name.ja}
// ${moment(event.startDate).format('YYYY-MM-DD HH:mm')}-${moment(event.endDate).format('HH:mm')}
// @${event.superEvent.location.name.ja} ${event.location.name.ja}
// ${reservedTickets}
// --------------------
// 決済方法
// --------------------
// ${order.paymentMethods.map((p) => p.paymentMethod).join(' ')}
// ${order.price}
// --------------------
// 割引
// --------------------
// `;
//     await LINE.pushMessage(user.userId, orderDetails);
//     await request.post({
//         simple: false,
//         url: 'https://api.line.me/v2/bot/message/push',
//         auth: { bearer: process.env.LINE_BOT_CHANNEL_ACCESS_TOKEN },
//         json: true,
//         body: {
//             to: user.userId,
//             messages: [
//                 {
//                     type: 'template',
//                     altText: 'this is a carousel template',
//                     template: {
//                         type: 'carousel',
//                         columns: order.acceptedOffers.map((offer) => {
//                             const itemOffered = offer.itemOffered;
//                             // tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
//                             const qr = `https://chart.apis.google.com/chart?chs=300x300&cht=qr&chl=${itemOffered.reservedTicket.ticketToken}`;
//                             return {
//                                 thumbnailImageUrl: qr,
//                                 // imageBackgroundColor: '#000000',
//                                 title: itemOffered.reservationFor.name.ja,
//                                 // tslint:disable-next-line:max-line-length
//                                 text: `${itemOffered.reservedTicket.ticketedSeat.seatNumber}`,
//                                 actions: [
//                                     {
//                                         type: 'postback',
//                                         label: '???',
//                                         data: `action=selectTicket&ticketToken=${itemOffered.reservedTicket.ticketToken}`
//                                     }
//                                 ]
//                             };
//                         }),
//                         imageAspectRatio: 'square'
//                         // imageSize: 'cover'
//                     }
//                 }
//             ]
//         }
//     }).promise();
// }
/**
 * 友達決済を承認確定
 * @param user LINEユーザー
 * @param transactionId 取引ID
 */
// export async function confirmFriendPay(user: User, token: string) {
//     const friendPayInfo = await user.verifyFriendPayToken(token);
//     await LINE.pushMessage(user.userId, `${friendPayInfo.price}円の友達決済を受け付けます。`);
//     await LINE.pushMessage(user.userId, '残高を確認しています...');
//     const placeOrderService = new kwskfsapi.service.transaction.PlaceOrder({
//         endpoint: <string>process.env.API_ENDPOINT,
//         auth: user.authClient
//     });
//     const actionRepo = new kwskfs.repository.Action(kwskfs.mongoose.connection);
//     let seatReservations = await actionRepo.findAuthorizeByTransactionId(friendPayInfo.transactionId);
//     seatReservations = seatReservations
//         .filter((a) => a.actionStatus === kwskfsapi.factory.actionStatusType.CompletedActionStatus)
//         .filter((a) => a.object.typeOf === kwskfsapi.factory.action.authorize.seatReservation.ObjectType.SeatReservation);
//     const price = seatReservations[0].result.price;
//     const pecorinoAuthorization = await placeOrderService.createPecorinoAuthorization({
//         transactionId: friendPayInfo.transactionId,
//         price: price
//     });
//     debug('Pecorino残高確認済', pecorinoAuthorization);
//     await LINE.pushMessage(user.userId, '残高の確認がとれました。');
//     await LINE.pushMessage(user.userId, '友達決済を承認しました。');
//     await request.post({
//         simple: false,
//         url: 'https://api.line.me/v2/bot/message/push',
//         auth: { bearer: process.env.LINE_BOT_CHANNEL_ACCESS_TOKEN },
//         json: true,
//         body: {
//             to: friendPayInfo.userId,
//             messages: [
//                 {
//                     type: 'template',
//                     altText: 'This is a buttons template',
//                     template: {
//                         type: 'confirm',
//                         text: '友達決済の承認が確認できました。取引を続行しますか?',
//                         actions: [
//                             {
//                                 type: 'postback',
//                                 label: 'Yes',
// tslint:disable-next-line:max-line-length
//                                 data: `action=continueTransactionAfterFriendPayConfirmation&transactionId=${friendPayInfo.transactionId}&price=${friendPayInfo.price}`
//                             },
//                             {
//                                 type: 'postback',
//                                 label: 'No',
// tslint:disable-next-line:max-line-length
//                                 data: `action=cancelTransactionAfterFriendPayConfirmation&transactionId=${friendPayInfo.transactionId}&price=${friendPayInfo.price}`
//                             }
//                         ]
//                     }
//                 }
//             ]
//         }
//     }).promise();
// }
/**
 * おこづかい承認確定
 * @param user LINEユーザー
 * @param token 金額転送情報トークン
 */
function confirmTransferMoney(user, token, price) {
    return __awaiter(this, void 0, void 0, function* () {
        const transferMoneyInfo = yield user.verifyTransferMoneyToken(token);
        yield LINE.pushMessage(user.userId, `${transferMoneyInfo.name}に${price}円の振込を実行します...`);
        if (PECORINO_API_ENDPOINT === undefined) {
            throw new Error('PECORINO_API_ENDPOINT undefined.');
        }
        if (PECORINO_CLIENT_ID === undefined) {
            throw new Error('PECORINO_CLIENT_ID undefined.');
        }
        if (PECORINO_CLIENT_SECRET === undefined) {
            throw new Error('PECORINO_CLIENT_SECRET undefined.');
        }
        if (PECORINO_AUTHORIZE_SERVER_DOMAIN === undefined) {
            throw new Error('PECORINO_AUTHORIZE_SERVER_DOMAIN undefined.');
        }
        const auth = new pecorinoapi.auth.ClientCredentials({
            domain: PECORINO_AUTHORIZE_SERVER_DOMAIN,
            clientId: PECORINO_CLIENT_ID,
            clientSecret: PECORINO_CLIENT_SECRET,
            scopes: [],
            state: ''
        });
        const oauth2client = new pecorinoapi.auth.OAuth2({
            domain: PECORINO_AUTHORIZE_SERVER_DOMAIN
        });
        oauth2client.setCredentials({
            access_token: yield user.authClient.getAccessToken()
        });
        const transferTransactionService4backend = new pecorinoapi.service.transaction.Transfer({
            endpoint: PECORINO_API_ENDPOINT,
            auth: auth
        });
        const transferTransactionService4frontend = new pecorinoapi.service.transaction.Transfer({
            endpoint: PECORINO_API_ENDPOINT,
            auth: oauth2client
        });
        const transaction = yield transferTransactionService4frontend.start({
            agent: {
                name: 'kwskfs-line-ticket'
            },
            // tslint:disable-next-line:no-magic-numbers
            expires: moment().add(10, 'minutes').toDate(),
            recipient: {
                typeOf: 'Person',
                id: transferMoneyInfo.userId,
                name: transferMoneyInfo.name,
                url: ''
            },
            amount: price,
            notes: 'LINEチケットおこづかい',
            fromAccountNumber: '',
            toAccountNumber: transferMoneyInfo.accountId
        });
        debug('transaction started.', transaction.id);
        yield LINE.pushMessage(user.userId, '残高の確認がとれました。');
        // バックエンドで確定
        yield transferTransactionService4backend.confirm({
            transactionId: transaction.id
        });
        debug('transaction confirmed.');
        yield LINE.pushMessage(user.userId, '転送が完了しました。');
        const personService = new kwskfsapi.service.Person({
            endpoint: process.env.API_ENDPOINT,
            auth: user.authClient
        });
        const contact = yield personService.getContacts({ personId: 'me' });
        // 振込先に通知
        yield LINE.pushMessage(transferMoneyInfo.userId, `${contact.familyName} ${contact.givenName}から${price}円おこづかいが振り込まれました。`);
    });
}
exports.confirmTransferMoney = confirmTransferMoney;
/**
 * クレジットから口座へ入金する
 */
function selectDepositAmount(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const gmoShopId = 'tshop00026096';
        const creditCardCallback = `https://${user.host}/transactions/transactionId/inputCreditCard?userId=${user.userId}`;
        // tslint:disable-next-line:max-line-length
        const creditCardUrl = `https://${user.host}/transactions/inputCreditCard?cb=${encodeURIComponent(creditCardCallback)}&gmoShopId=${gmoShopId}`;
        yield request.post({
            simple: false,
            url: 'https://api.line.me/v2/bot/message/push',
            auth: { bearer: process.env.LINE_BOT_CHANNEL_ACCESS_TOKEN },
            json: true,
            body: {
                to: user.userId,
                messages: [
                    {
                        type: 'template',
                        altText: '口座へ入金',
                        template: {
                            type: 'buttons',
                            title: 'Pecorino口座へ入金する',
                            text: 'いくら入金しますか?',
                            actions: [
                                {
                                    type: 'uri',
                                    label: '100円',
                                    uri: `${creditCardUrl}&amount=100`
                                }
                            ]
                        }
                    }
                ]
            }
        }).promise();
    });
}
exports.selectDepositAmount = selectDepositAmount;
/**
 * クレジットから口座へ入金する
 */
function depositFromCreditCard(user, amount, __) {
    return __awaiter(this, void 0, void 0, function* () {
        yield LINE.pushMessage(user.userId, `${amount}円の入金処理を実行します...`);
        // const personService = new kwskfsapi.service.Person({
        //     endpoint: <string>process.env.API_ENDPOINT,
        //     auth: user.authClient
        // });
        // if (PECORINO_API_ENDPOINT === undefined) {
        //     throw new Error('PECORINO_API_ENDPOINT undefined.');
        // }
        // if (PECORINO_CLIENT_ID === undefined) {
        //     throw new Error('PECORINO_CLIENT_ID undefined.');
        // }
        // if (PECORINO_CLIENT_SECRET === undefined) {
        //     throw new Error('PECORINO_CLIENT_SECRET undefined.');
        // }
        // if (PECORINO_AUTHORIZE_SERVER_DOMAIN === undefined) {
        //     throw new Error('PECORINO_AUTHORIZE_SERVER_DOMAIN undefined.');
        // }
        // const auth = new pecorinoapi.auth.ClientCredentials({
        //     domain: PECORINO_AUTHORIZE_SERVER_DOMAIN,
        //     clientId: PECORINO_CLIENT_ID,
        //     clientSecret: PECORINO_CLIENT_SECRET,
        //     scopes: [],
        //     state: ''
        // });
        // const transferTransactionService4backend = new pecorinoapi.service.transaction.Deposit({
        //     endpoint: PECORINO_API_ENDPOINT,
        //     auth: auth
        // });
        // const transaction = await transferTransactionService4backend.start({
        //     // tslint:disable-next-line:no-magic-numbers
        //     expires: moment().add(10, 'minutes').toDate(),
        //     agent: {
        //         typeOf: 'Person',
        //         id: user.userId,
        //         name: 'self',
        //         url: ''
        //     },
        //     recipient: {
        //         typeOf: 'Person',
        //         id: user.userId,
        //         name: 'self',
        //         url: ''
        //     },
        //     price: amount,
        //     notes: 'LINEチケット入金',
        //     toAccountId: account.id
        // });
        // debug('transaction started.', transaction.id);
        // // バックエンドで確定
        // await transferTransactionService4backend.confirm({
        //     transactionId: transaction.id
        // });
        // debug('transaction confirmed.');
        yield LINE.pushMessage(user.userId, '入金処理が完了しました。');
    });
}
exports.depositFromCreditCard = depositFromCreditCard;
