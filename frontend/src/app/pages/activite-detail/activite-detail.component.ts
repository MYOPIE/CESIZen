import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Activite, ActiviteService } from '../../services/activite.service';
import { parseRichContent, RichContentBlock, getVideoEmbedUrl } from '../../shared/utils/rich-content.util';

@Component({
  selector: 'app-activite-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './activite-detail.component.html',
  styleUrls: ['./activite-detail.component.scss']
})
export class ActiviteDetailComponent implements OnInit {
  activite: Activite | null = null;
  contentBlocks: RichContentBlock[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private activiteService: ActiviteService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id)) {
      this.isLoading = false;
      this.errorMessage = 'Activite introuvable.';
      this.cdr.detectChanges();
      return;
    }

    this.activiteService.getActiviteById(id).subscribe({
      next: (activite) => {
        this.activite = activite;
        this.contentBlocks = parseRichContent(activite.content);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger cette activite.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getSafeVideoUrl(url: string | undefined): SafeResourceUrl | null {
    if (!url) {
      return null;
    }

    const embedUrl = getVideoEmbedUrl(url);
    if (!embedUrl) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
