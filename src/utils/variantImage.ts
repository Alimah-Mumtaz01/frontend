import soesSatuPcs from "../assets/images/varian/soes-1-pcs.png";
import soesStrawberry from "../assets/images/varian/soes strawberry.png";
import soesCokelat from "../assets/images/varian/soes-cokelat.png";
import soesDurian from "../assets/images/varian/soes-durian.png";
import soesMatcha from "../assets/images/varian/soes-matcha.png";
import soesBlueberry from "../assets/images/varian/soes-blueberry.png";
import soesMangga from "../assets/images/varian/soes-mangga.png";
import soesTiramisu from "../assets/images/varian/soes-tiramisu.png";
import vanilla from "../assets/images/varian/vanilla.png";
import strawberry from "../assets/images/varian/strawberry.jpg";
import cokelat from "../assets/images/varian/cokelat.png";
import durian from "../assets/images/varian/durian.png";
import matcha from "../assets/images/varian/matcha.png";
import blueberry from "../assets/images/varian/blueberry.png";
import mangga from "../assets/images/varian/mangga.png";
import tiramisu from "../assets/images/varian/tiramisu.png";

const variantImages: Record<string, string> = {
    original: soesSatuPcs,
    vanilla: soesSatuPcs,
    "1 pcs": soesSatuPcs,
    "soes 1 pcs": soesSatuPcs,
    strawberry: soesStrawberry,
    stroberi: soesStrawberry,
    cokelat: soesCokelat,
    chocolate: soesCokelat,
    durian: soesDurian,
    matcha: soesMatcha,
    blueberry: soesBlueberry,
    mangga: soesMangga,
    mango: soesMangga,
    tiramisu: soesTiramisu,
};

const variantThumbnails: Record<string, string> = {
    original: vanilla,
    vanilla,
    "1 pcs": vanilla,
    "soes 1 pcs": vanilla,
    strawberry,
    stroberi: strawberry,
    cokelat,
    chocolate: cokelat,
    durian,
    matcha,
    blueberry,
    mangga,
    mango: mangga,
    tiramisu,
};

const normalizeVariantName = (namaVarian: string) =>
    namaVarian.trim().toLowerCase();

export const getVariantImage = (namaVarian: string): string => {
    return variantImages[normalizeVariantName(namaVarian)] ?? soesSatuPcs;
};

export const getVariantThumbnail = (namaVarian: string): string => {
    return variantThumbnails[normalizeVariantName(namaVarian)] ?? vanilla;
};