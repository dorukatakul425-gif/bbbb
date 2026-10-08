import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import vipAsset from "@/assets/vip-art.png.asset.json";
const vip = vipAsset.url;
import chestAsset from "@/assets/chest-art.png.asset.json";
const chest = chestAsset.url;
import potAsset from "@/assets/pot-art.png.asset.json";
const pot = potAsset.url;
import sackAsset from "@/assets/sack-art.png.asset.json";
const sack = sackAsset.url;
import boxAsset from "@/assets/box-art.png.asset.json";
const box = boxAsset.url;
import heartsAsset from "@/assets/hearts-art.png.asset.json";
const hearts = heartsAsset.url;
import rabbitAsset from "@/assets/rabbit-art.png.asset.json";
const rabbit = rabbitAsset.url;
import patternAsset from "@/assets/heart-pattern.png.asset.json";
const pattern = patternAsset.url;
import heartAsset from "@/assets/offer-heart.png.asset.json";
const heart = heartAsset.url;
import coinAsset from "@/assets/offer-coin.png.asset.json";
const coin = coinAsset.url;

const offers = [
  { amount: "VIP", bonus: "STATUS", art: vip, price: "Details", vip: true },
  { amount: "12500", bonus: "25% BONUS", art: chest, price: "10000", badge: "Best offer" },
  { amount: "6000", bonus: "20% BONUS", art: pot, price: "5000" },
  { amount: "2200", bonus: "10% BONUS", art: sack, price: "2000", badge: "Best pick" },
  { amount: "500", art: box, price: "500" },
  { amount: "10", art: hearts, price: "10" },
  { amount: "20", art: rabbit, price: "Göndər", coin: true, gift: true },
  { amount: "20", art: rabbit, price: "Göndər", gift: true },
];

export function HeartShop({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="heart-shop-backdrop" />
        <DialogPrimitive.Content className="heart-shop" aria-describedby={undefined} onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.querySelector<HTMLButtonElement>(".heart-control")?.focus();
        }}>
          <div className="heart-shop-surface">
            <img className="heart-shop-pattern" src={pattern} alt="" />
            <DialogPrimitive.Title className="heart-shop-title">Buy hearts</DialogPrimitive.Title>
            <div className="heart-offers">
              {offers.map((offer, index) => (
                <article className={`heart-offer${offer.vip ? " vip-offer" : ""}`} key={index}>
                  {offer.badge && <span className={`offer-badge${index === 3 ? " pick-badge" : ""}`}>{offer.badge}</span>}
                  <div className="offer-heading">
                    <div className="offer-amount">
                      {!offer.vip && <img src={offer.coin ? coin : heart} alt={offer.coin ? "GM" : "Hearts"} />}
                      <span>{offer.amount}</span>
                    </div>
                    {offer.bonus && <div className="offer-bonus">{offer.bonus}</div>}
                  </div>
                  <img className="offer-art" src={offer.art} alt="" draggable={false} />
                  <Button variant="reference" size="reference" className={`offer-price${offer.vip ? " vip-price" : ""}`} aria-label={offer.vip ? "VIP Details" : `${offer.amount} ${offer.coin ? "GM" : "hearts"}, ${offer.price}${offer.gift ? "" : " GM"}`}>
                    {offer.price}
                    {!offer.vip && !offer.gift && <img src={coin} alt="GM" />}
                  </Button>
                </article>
              ))}
            </div>
          </div>
          <DialogPrimitive.Close asChild>
            <Button variant="reference" size="reference" className="heart-shop-close" aria-label="Close Buy hearts"><X strokeWidth={3} /></Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}